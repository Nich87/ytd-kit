import { json } from '@sveltejs/kit';
import { Innertube } from 'youtubei.js';

const yt = await Innertube.create();

export const GET = async ({ url }) => {
	const id = new URL(url).searchParams.get('v');
	const type = new URL(url).searchParams.get('type');
	if (!id) throw new Error('Invalid Id');

	try {
		if (type === 'video') {
			//TODO: この状態だと360p onlyのためffmpegで動画と音声を組み合わせて一つのstreamを返してあげる。
			const videoStream = await yt.download(id, {
				type: 'video+audio',
				quality: 'best',
				format: 'mp4'
			});

			return new Response(videoStream, {
				headers: {
					'Content-Type': 'video/mp4'
				}
			});
		}

		if (type === 'audio') {
			const audioStream = await yt.download(id, {
				type: 'audio',
				quality: 'best',
				format: 'any'
			});
			return new Response(audioStream, {
				headers: {
					'Content-Type': 'audio/mpeg'
				}
			});
		}
	} catch (error) {
		console.error(error);
		return json(
			{
				error: 'Internal Server Error',
				errorobj: error
			},
			{
				status: 500
			}
		);
	}
};
