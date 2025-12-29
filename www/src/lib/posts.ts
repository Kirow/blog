export type Post = {
	title: string;
	date: string;
	tags: string[];
	slug: string;
	description: string;
	readingTime: string;
};

export async function getPosts() {
	const paths = import.meta.glob('/src/posts/*.md', { eager: true });

	const posts = Object.entries(paths).map(([path, file]) => {
		const slug = path.split('/').pop()?.replace('.md', '');
		
		if (!file || typeof file !== 'object' || !('metadata' in file)) {
			throw new Error(`File at ${path} is missing metadata`);
		}
		
		const metadata = (file as any).metadata as {
			title: string;
			date: string;
			tags: string[];
			description: string;
			'reading-time': string;
		};
		
		return { 
			title: metadata.title,
			date: metadata.date,
			tags: metadata.tags,
			description: metadata.description,
			readingTime: metadata['reading-time'],
			slug: slug || '' 
		} satisfies Post;
	});

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
