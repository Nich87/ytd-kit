import { youtubeService } from '$lib/services/youtube';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET = (async ({ url }: { url: URL }) => {
	const query = new URL(url).searchParams.get('q');

	if (!query) {
		return json(
			{
				error: 'No query provided'
			},
			{ status: 400 }
		);
	}

	try {
		const searchResults = await youtubeService.searchVideos(query);

		if (!searchResults) {
			return json(
				{
					error: 'Results not found'
				},
				{
					status: 404
				}
			);
		}

		return json(searchResults);
	} catch (error) {
		console.error('Search error:', error);
		return json(
			{
				error: 'Internal Server Error'
			},
			{
				status: 500
			}
		);
	}
}) satisfies RequestHandler;
