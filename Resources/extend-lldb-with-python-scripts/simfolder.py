"""
LLDB Simulator Folder Utilities

This module provides LLDB commands for opening iOS Simulator app folders in Finder.
It includes utilities to locate and open:
    - The running app's sandbox folder (Documents, Library, tmp, etc.)
    - The Files app's shared storage folder (File Provider Storage)

Usage:
    1. Load the script in LLDB:
       (lldb) command script import /path/to/simfolder.py

    2. Use the registered commands:
       (lldb) documents   # Opens the app's sandbox folder in Finder
       (lldb) files       # Opens the Files app storage folder in Finder

Requirements:
    - macOS with Xcode and iOS Simulator
    - App must be running in the debugger
"""

import os
import re
import subprocess
from typing import Any, Dict, Optional

import lldb

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# The app group identifier used by the Files app for local storage
FILES_APP_GROUP_IDENTIFIER: str = "group.com.apple.FileProvider.LocalStorage"

# The directory name where File Provider stores files
FILE_PROVIDER_STORAGE_DIR: str = "File Provider Storage"

# Metadata plist filename used by Container Manager
CONTAINER_METADATA_PLIST: str = ".com.apple.mobile_container_manager.metadata.plist"


# ---------------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------------


def get_documents_path(
    debugger: lldb.SBDebugger,
    command: str,
    result: lldb.SBCommandReturnObject,
    internal_dict: Dict[str, Any],
) -> str:
    """
    Retrieve the Documents directory path of the running iOS app.

    This function executes an Objective-C expression in the debugger to get
    the app's Documents directory path using NSSearchPathForDirectoriesInDomains.

    Args:
        debugger: The LLDB debugger instance.
        command: The command string (unused, required by LLDB signature).
        result: The command return object (unused, required by LLDB signature).
        internal_dict: Internal LLDB dictionary (unused, required by LLDB signature).

    Returns:
        The absolute path to the app's Documents directory as a string.
    """
    # Import Foundation framework to ensure NSSearchPathForDirectoriesInDomains is available
    debugger.HandleCommand("expr @import Foundation")

    # Build the Objective-C expression to retrieve the Documents directory path
    # NSDocumentDirectory = 9, NSUserDomainMask = 1
    documents_path_expression: str = (
        "po (NSString *)[NSSearchPathForDirectoriesInDomains("
        "NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0]"
    )

    # Execute the expression and capture the output
    documents_path_result = lldb.SBCommandReturnObject()
    debugger.GetCommandInterpreter().HandleCommand(
        documents_path_expression, documents_path_result
    )

    # Parse the output: strip whitespace and surrounding quotes
    raw_output: str = documents_path_result.GetOutput()
    cleaned_path: str = raw_output.strip().strip('"')

    return cleaned_path


def find_containers_base_path(documents_path: str) -> str:
    """
    Navigate up from the Documents path to find the Containers directory.

    iOS Simulator app data is stored in:
    ~/Library/Developer/CoreSimulator/Devices/<UUID>/data/Containers/

    This function traverses up the directory tree until it finds the
    'Containers' folder.

    Args:
        documents_path: The full path to the app's Documents directory.

    Returns:
        The path to the Containers directory.
    """
    path: str = documents_path

    # Traverse up the directory tree until we reach 'Containers'
    while path and not path.endswith("Containers"):
        path = os.path.dirname(path)

    return path


def find_file_provider_storage_folders(base_path: str) -> list[str]:
    """
    Recursively search for 'File Provider Storage' directories.

    Uses the system 'find' command to locate all directories named
    'File Provider Storage' within the given base path.

    Args:
        base_path: The root path to search from.

    Returns:
        A list of absolute paths to File Provider Storage directories.
    """
    find_command: str = (
        f'find "{base_path}" -type d -name "{FILE_PROVIDER_STORAGE_DIR}"'
    )

    try:
        find_output: str = subprocess.check_output(
            find_command, shell=True, stderr=subprocess.DEVNULL
        ).decode("utf-8")
    except subprocess.CalledProcessError:
        return []

    # Split output by newlines and filter out empty strings
    folders: list[str] = [
        folder for folder in find_output.split("\n") if folder.strip()
    ]

    return folders


def read_container_metadata_identifier(metadata_path: str) -> Optional[str]:
    """
    Read the MCMMetadataIdentifier from a container's metadata plist.

    Each app container has a metadata plist that identifies its app group
    or bundle identifier. This function extracts that identifier.

    Args:
        metadata_path: Path to the .com.apple.mobile_container_manager.metadata.plist file.

    Returns:
        The MCMMetadataIdentifier string if found, None otherwise.
    """
    try:
        # Use plutil to convert plist to human-readable format
        plutil_output: str = subprocess.check_output(
            ["plutil", "-p", metadata_path], stderr=subprocess.DEVNULL
        ).decode("utf-8")

        # Extract the identifier using regex
        # Format: "MCMMetadataIdentifier" => "identifier.string"
        match = re.search(r'"MCMMetadataIdentifier"\s*=>\s*"([^"]+)"', plutil_output)

        if match:
            return match.group(1)

    except subprocess.CalledProcessError:
        pass

    return None


def get_files_app_folder_from_documents(documents_path: str) -> Optional[str]:
    """
    Locate the Files app's File Provider Storage folder.

    The Files app uses a shared app group container for storing files.
    This function navigates from the app's Documents path to find the
    Files app's storage location by:
    1. Finding the Containers base directory
    2. Searching the Shared/AppGroup folder for File Provider Storage
    3. Identifying the correct container by its metadata identifier

    Args:
        documents_path: The running app's Documents directory path.

    Returns:
        The path to the Files app's File Provider Storage folder,
        or None if not found.
    """
    # Navigate up to the Containers directory
    containers_path: str = find_containers_base_path(documents_path)

    if not containers_path:
        return None

    # Construct path to shared app group containers
    # Structure: .../Containers/Shared/AppGroup/<UUID>/
    shared_app_group_path: str = os.path.join(containers_path, "Shared", "AppGroup")

    if not os.path.exists(shared_app_group_path):
        return None

    # Find all File Provider Storage directories
    storage_folders: list[str] = find_file_provider_storage_folders(
        shared_app_group_path
    )

    # Search for the Files app's container
    for storage_folder in storage_folders:
        # Get the container folder (parent of "File Provider Storage")
        container_folder: str = os.path.dirname(storage_folder)

        # Check for the metadata plist
        metadata_path: str = os.path.join(container_folder, CONTAINER_METADATA_PLIST)

        if not os.path.exists(metadata_path):
            continue

        # Read and verify the container identifier
        identifier: Optional[str] = read_container_metadata_identifier(metadata_path)

        if identifier == FILES_APP_GROUP_IDENTIFIER:
            return storage_folder

    return None


# ---------------------------------------------------------------------------
# LLDB Command Functions
# ---------------------------------------------------------------------------


def open_simulator_folder(
    debugger: lldb.SBDebugger,
    command: str,
    result: lldb.SBCommandReturnObject,
    internal_dict: Dict[str, Any],
) -> None:
    """
    LLDB command to open the running app's sandbox folder in Finder.

    This opens the parent directory of the Documents folder, which is the
    app's sandbox root containing:
    - Documents/
    - Library/
    - tmp/
    - SystemData/ (if applicable)

    Usage in LLDB:
        (lldb) documents
    """
    print("Opening the simulator running app folder...")

    # Get the Documents directory path
    documents_path: str = get_documents_path(debugger, command, result, internal_dict)

    # Verify we're dealing with a local simulator path
    if not documents_path.startswith("/Users/"):
        print(
            f"Error: The path does not appear to be on the local machine: {documents_path}"
        )
        return

    # Navigate to the app's sandbox root (parent of Documents)
    app_sandbox_folder: str = os.path.dirname(documents_path)

    # Open the folder in Finder
    subprocess.call(["open", app_sandbox_folder])
    print(f"Opened: {app_sandbox_folder}")


def open_simulator_files_app_folder(
    debugger: lldb.SBDebugger,
    command: str,
    result: lldb.SBCommandReturnObject,
    internal_dict: Dict[str, Any],
) -> None:
    """
    LLDB command to open the Files app's storage folder in Finder.

    This locates and opens the 'File Provider Storage' directory used by
    the iOS Files app for "On My iPhone/iPad" storage.

    Usage in LLDB:
        (lldb) files
    """
    print("Opening the simulator Files app folder...")

    # Get the Documents directory path as a starting point
    documents_path: str = get_documents_path(debugger, command, result, internal_dict)

    # Locate the Files app's storage folder
    files_app_folder: Optional[str] = get_files_app_folder_from_documents(
        documents_path
    )

    if files_app_folder:
        subprocess.call(["open", files_app_folder])
        print(f"Opened: {files_app_folder}")
    else:
        print("Error: Files app folder not found.")
        print("Make sure the simulator has been used with the Files app at least once.")


# ---------------------------------------------------------------------------
# LLDB Module Initialization
# ---------------------------------------------------------------------------


def __lldb_init_module(
    debugger: lldb.SBDebugger, internal_dict: Dict[str, Any]
) -> None:
    """
    Initialize the LLDB module and register custom commands.

    This function is automatically called by LLDB when the script is imported
    using 'command script import'.

    Registered Commands:
        - documents: Opens the app's sandbox folder in Finder
        - files: Opens the Files app's storage folder in Finder

    Args:
        debugger: The LLDB debugger instance.
        internal_dict: Internal LLDB dictionary for state storage.
    """
    # Register the 'documents' command
    debugger.HandleCommand(
        "command script add -f simfolder.open_simulator_folder documents"
    )

    # Register the 'files' command
    debugger.HandleCommand(
        "command script add -f simfolder.open_simulator_files_app_folder files"
    )

    # Print confirmation message
    print("Simulator folder commands loaded:")
    print('  - "documents" : Open the running app\'s sandbox folder')
    print('  - "files"     : Open the Files app storage folder')
