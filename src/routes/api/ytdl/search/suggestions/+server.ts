import { json } from '@sveltejs/kit';
import { Innertube } from 'youtubei.js';
import type { RequestHandler } from '../$types';

const yt = await Innertube.create();

export const GET = (async ({ url }: { url: URL }) => {
	const query = new URL(url).searchParams.get('q');

	if (!query) throw new Error('No query');

	try {
		const searchResults = await yt.getSearchSuggestions(query);

		if (!searchResults)
			return json(
				{
					error: 'results not found'
				},
				{
					status: 404
				}
			);

		return new Response(JSON.stringify(searchResults), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error(error);
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
