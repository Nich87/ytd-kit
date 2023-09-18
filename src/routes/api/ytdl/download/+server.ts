import { Innertube } from 'youtubei.js';
const yt = await Innertube.create();
// import ffmpeg from 'fluent-ffmpeg';
// import ffmpegStatic from 'ffmpeg-static';
// import ffprobeStatic from 'ffprobe-static';
// ffmpeg.setFfmpegPath(ffmpegStatic.path)
// ffmpeg.setFfprobePath(ffprobeStatic.path)
// import { StreamInput } from 'fluent-ffmpeg-multistream';
// import { Readable } from 'node:stream';
import { json } from '@sveltejs/kit';

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
			// const audioStream = await yt.download(id, {
			// 	type: 'audio',
			// 	quality: 'best',
			// 	format: 'mp3'
			// });

			// const stream = (await createVideo(videoStream,audioStream,id)).run();

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
				error: 'Internal Server Error'
			},
			{
				status: 500
			}
		);
	}
};

// async function createVideo(videoStream,audioStream,id) {
// 			const stream = await ffmpeg()
// 			.addInput(StreamInput(new Readable.fromWeb(videoStream)).url)
// 			.addInput(StreamInput(new Readable.fromWeb(audioStream)).url)
// 			.addOptions(['-map 0:v','-map 1:a','-c:v copy'])
// 			.format('mp4')
// 			.on('progress',(progress) => {
// 				console.log(progress.percent+'%');
// 			})
// 			.on('end', () => {
// 				console.log('passed');
// 			}).on('error', (err) => {
// 				console.error(err);
// 				console.error(err.stack);
// 			})
// 			.output(`${id}`)
// 			// .save(`${id}.mp4`);

// 			return stream;
// }

// process.on('uncaughtException', console.log);
