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
		const suggestions = await youtubeService.getSearchSuggestions(query);

		if (!suggestions) {
			return json(
				{
					error: 'Suggestions not found'
				},
				{
					status: 404
				}
			);
		}

		return json(suggestions);
	} catch (error) {
		console.error('Suggestions error:', error);
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
