import { youtubeService } from '$lib/services/youtube';
import { parsePlaylistUrl } from '$lib/utils/url-parser';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET = (async ({ url }: { url: URL }) => {
	const playlistURL = new URL(url).searchParams.get('url') as string;
	const playlistId = parsePlaylistUrl(playlistURL);

	if (!playlistId) {
		return json(
			{
				error: 'No PlaylistId'
			},
			{ status: 404 }
		);
	}

	const playlistInfo = await youtubeService.getPlaylistInfo(playlistId);
	if (!playlistInfo) {
		return json({ error: 'Playlist NotFound' }, { status: 404 });
	}

	return json(playlistInfo);
}) satisfies RequestHandler;
