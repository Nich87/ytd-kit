import ytdl from 'ytdl-core';
import { json } from '@sveltejs/kit';

async function getInfo(id: string): Promise<ytdl.videoInfo | null> {
	try {
		return await ytdl.getInfo(id);
	} catch (error) {
		return null;
	}
}

export const GET = async ({ url }) => {
	const _url = new URL(url).searchParams.get('video_url');
	if (!_url)
		return json(
			{
				error: 'No videoId'
			},
			{ status: 404 }
		);
	if (!(await ytdl.validateURL(_url)))
		return json(
			{
				error: 'Invalid URL'
			},
			{ status: 400 }
		);

	const id = await ytdl.getURLVideoID(_url);

	if (!(await ytdl.validateID(id)))
		return json(
			{
				error: 'Invalid videoId'
			},
			{ status: 404 }
		);
	const videoInfo = await getInfo(id);
	if (!videoInfo) return json({ error: 'videoInfo NotFound' }, { status: 404 });
	return json(videoInfo);
};
