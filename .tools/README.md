# .tools Directory

This directory contains utility scripts and helper tools for your project. Each subdirectory within `.tools` is dedicated to a specific tool or integration, making it easy to organize and maintain scripts as your project grows.

## Current Tools

- **browsermcp**:  
  Contains `init.sh`, a script that reads the `BUN_EXE` variable from your project’s `.env` file and launches the BrowserMCP server using Bun.

## Adding New Tools

To add a new tool, create a subdirectory under `.tools` (e.g., `.tools/mytool`) and place your scripts or helper files there. Document each tool’s purpose and usage in this README or in a dedicated README within the tool’s subdirectory.

## Making Scripts Executable

After adding a new script, you must make it executable so it can be run directly from the command line or by other tools.

**To make a script executable:**

```sh
chmod +x .tools/<toolname>/<scriptname>.sh
```

For example, to make the `init.sh` script for `browsermcp` executable, run:

```sh
chmod +x .tools/browsermcp/init.sh
```

## Best Practices

- Keep each tool in its own subdirectory.
- Use clear, descriptive names for scripts and tools.
- Document the purpose and usage of each tool.
- Handle errors gracefully in scripts (e.g., check for missing dependencies or environment variables).

---

As your project evolves, this directory will help you keep all automation and helper scripts organized and easy to use.