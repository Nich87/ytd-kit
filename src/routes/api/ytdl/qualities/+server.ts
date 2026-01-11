import { youtubeService } from '$lib/services/youtube';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET = (async ({ url }: { url: URL }) => {
	const id = new URL(url).searchParams.get('v');

	if (!id) {
		return json(
			{
				error: 'Invalid video ID'
			},
			{ status: 400 }
		);
	}

	try {
		console.log(`Getting available qualities for video: ${id}`);
		const qualities = await youtubeService.getAvailableQualities(id);

		if (!qualities) {
			return json(
				{
					error: 'Failed to get video qualities'
				},
				{ status: 500 }
			);
		}

		return json({
			video_id: id,
			qualities: qualities,
			optimization_available: true,
			merge_available: true,
			ffmpeg_installed: true,
			recommended: {
				video: 'highestvideo',
				audio: 'highestaudio',
				method: 'merge_priority',
				merge_enabled: true
			},
			download_options: {
				standard: `?v=${id}&type=video&quality=best`,
				high_quality_merge: `?v=${id}&type=video&merge=true&video_quality=highestvideo&audio_quality=highestaudio`,
				custom_quality: `?v=${id}&type=video&merge=true&video_quality=1080p&audio_quality=best`,
				audio_only: `?v=${id}&type=audio&quality=best`
			},
			features: {
				'highest_quality_merge': '最初から最高品質のvideoとaudioを別々にダウンロードしてFFmpegで統合',
				'separate_optimization': 'video品質とaudio品質を個別に最適化',
				'ffmpeg_integration': 'FFmpegによる高品質統合処理',
				'quality_control': 'highestvideo/highestaudioで確実に最高品質を取得'
			}
		});
	} catch (error) {
		console.error('Error getting video qualities:', error);
		return json(
			{
				error: 'Internal Server Error',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{
				status: 500
			}
		);
	}
}) satisfies RequestHandler;