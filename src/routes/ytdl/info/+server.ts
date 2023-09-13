import ytdl from 'ytdl-core';
import { json } from '@sveltejs/kit';

async function getInfo(id: string): Promise<ytdl.videoInfo | null> {
	try {
		console.log(await ytdl.validateID(id));
		return await ytdl.getInfo(id);
	} catch (error) {
		return null;
	}
}

export const GET = async ({ url }) => {
	const _url = new URL(url).searchParams.get('video_url');
	if (!_url) return;
	if (!(await ytdl.validateURL(_url)))
		return json(
			{
				error: 'URLが不正です。'
			},
			{ status: 400 }
		);

	const id = await ytdl.getURLVideoID(_url);

	if (!(await ytdl.validateID(id)))
		return json(
			{
				error: 'VideoIDが不正です。'
			},
			{ status: 404 }
		);
	const videoInfo = await getInfo(id);
	if (!videoInfo) return json({ error: 'videoinfo not found.' }, { status: 404 });
	return json(videoInfo);
};
