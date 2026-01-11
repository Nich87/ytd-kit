import { youtubeService } from '$lib/services/youtube';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET = (async ({ url }: { url: URL }) => {
	const id = new URL(url).searchParams.get('id');
	if (!id) {
		return json(
			{
				error: 'No videoId'
			},
			{ status: 404 }
		);
	}

	const videoInfo = await youtubeService.getVideoInfo(id);
	if (!videoInfo) {
		return json({ error: 'videoInfo NotFound' }, { status: 404 });
	}

	return json(videoInfo);
}) satisfies RequestHandler;
