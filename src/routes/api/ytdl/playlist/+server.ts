import { json } from '@sveltejs/kit';
import { Innertube } from 'youtubei.js';

const yt = await Innertube.create();

async function getInfo(id: string) {
	try {
		return await yt.getPlaylist(id);
	} catch (error) {
		return null;
	}
}

export const GET = async ({ url }: { url: URL }) => {
	const playlistURL = new URL(url).searchParams.get('url') as string;
	const playlistId = new URL(playlistURL).searchParams.get('list');
	if (!playlistId)
		return json(
			{
				error: 'No PlaylistId'
			},
			{ status: 404 }
		);

	const playlistInfo = await getInfo(playlistId);
	if (!playlistInfo) return json({ error: 'Playlist NotFound' }, { status: 404 });

	const formattedPlaylistInfo = {
		title: playlistInfo.info.title,
		author: {
			name: playlistInfo.info.author.name,
			url: playlistInfo.info.author.thumbnails[0].url,
			width: playlistInfo.info.author,
			badges: playlistInfo.info.author.badges
		},
		description: playlistInfo.info.description
			? playlistInfo.info.description
			: 'Description NotFound.',
		itemCount: playlistInfo.info.total_items,
		videos: playlistInfo.videos.map((video) => ({
			title: video.title.runs ? video.title.runs[0].text : 'No title',
			videoId: video.id,
			url: `https://www.youtube.com/watch?v=${video.id}`
		}))
	};
	if (!formattedPlaylistInfo) return json({ error: 'playlistInfo NotFound' }, { status: 404 });

	return json(formattedPlaylistInfo);
};
