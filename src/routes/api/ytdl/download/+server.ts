import { youtubeService } from '$lib/services/youtube';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET = (async ({ url }: { url: URL }) => {
	const id = new URL(url).searchParams.get('v');
	const type = new URL(url).searchParams.get('type') as 'video' | 'audio';
	const quality = new URL(url).searchParams.get('quality');
	const optimized = new URL(url).searchParams.get('optimized') === 'true';
	const merge = new URL(url).searchParams.get('merge') === 'true';
	const videoQuality = new URL(url).searchParams.get('video_quality');
	const audioQuality = new URL(url).searchParams.get('audio_quality');

	if (!id) {
		return json(
			{
				error: 'Invalid Id'
			},
			{ status: 400 }
		);
	}

	if (!type || (type !== 'video' && type !== 'audio')) {
		return json(
			{
				error: 'Invalid type. Must be "video" or "audio"'
			},
			{ status: 400 }
		);
	}

	try {
		let stream: ReadableStream | null;

		// 統合ダウンロードを強制する場合
		if (merge && type === 'video') {
			console.log('Using forced merge download with separate video and audio streams');
			stream = await youtubeService.downloadVideoWithMerge(
				id,
				videoQuality || quality || undefined,
				audioQuality || undefined
			);
		}
		// 最適化されたダウンロードを使用するかどうか
		else if (optimized && type === 'video') {
			console.log('Using optimized download for high quality video+audio');
			stream = await youtubeService.downloadVideoOptimized(id);
		}
		// 標準ダウンロード（フォールバック機能付き）
		else {
			console.log(`Using standard download with fallback - Type: ${type}, Quality: ${quality || 'default'}`);
			stream = await youtubeService.downloadVideo(id, type, quality || undefined);
		}

		if (!stream) {
			return json(
				{
					error: 'Failed to get download stream'
				},
				{ status: 500 }
			);
		}

		const contentType = type === 'video' ? 'video/mp4' : 'audio/mpeg';
		const qualityInfo = quality ? ` (${quality})` : '';
		const optimizedInfo = optimized ? ' (optimized)' : '';
		const mergeInfo = merge ? ' (merged)' : '';

		return new Response(stream, {
			headers: {
				'Content-Type': contentType,
				'Content-Disposition': `attachment; filename="video_${id}${qualityInfo}${optimizedInfo}${mergeInfo}.${type === 'video' ? 'mp4' : 'mp3'}"`,
				'Cache-Control': 'no-cache',
				'Accept-Ranges': 'bytes'
			}
		});
	} catch (error) {
		console.error('Download error:', error);
		return json(
			{
				error: 'Internal Server Error',
				message: error instanceof Error ? error.message : 'Unknown error',
				details: process.env.NODE_ENV === 'development' ? error : undefined,
				fallback_suggestion: 'Try using merge=true parameter for better compatibility'
			},
			{
				status: 500
			}
		);
	}
}) satisfies RequestHandler;
