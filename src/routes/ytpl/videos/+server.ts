import { json } from '@sveltejs/kit';
import ytpl from 'ytpl';

export const GET = async ({ url }) => {
	const playlistURL = new URL(url).searchParams.get('video_url') as string;
	const playlistId = new URL(playlistURL).searchParams.get('list');
	if (!playlistId)
		return json(
			{
				error: 'No playlistId'
			},
			{ status: 404 }
		);
	try {
		const playlist = await ytpl(playlistId);

		if (!playlist.items || playlist.items.length === 0) {
			return json(
				{
					error: 'Playlist Not Found'
				},
				{ status: 404 }
			);
		}

		const formattedPlaylist = {
			title: playlist.title,
			author: playlist.author,
			description: playlist.description,
			itemCount: playlist.items.length,
			videos: playlist.items.map((item) => ({
				title: item.title,
				videoId: item.id,
				url: `https://www.youtube.com/watch?v=${item.id}`
			}))
		};

		return json(formattedPlaylist);
	} catch (error) {
		return json(
			{
				error: 'Internal Server Error'
			},
			{ status: 500 }
		);
	}
};
