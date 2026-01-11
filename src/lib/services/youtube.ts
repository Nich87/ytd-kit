import { Innertube } from 'youtubei.js';
import type { VideoInfo, PlaylistInfo, SearchInfo } from '$lib/types/youtube';
import { formatSecondsToTime, formatCount } from '$lib/utils/formatters';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import ffprobe from '@ffprobe-installer/ffprobe';
import { spawn } from 'child_process';
import { PassThrough, Readable } from 'stream';

/**
 * YouTube APIサービスクラス
 * Innertubeインスタンスを統一管理し、各機能へのアクセスを提供
 */
class YouTubeService {
	private static instance: YouTubeService;
	private innertube: Innertube | null = null;

	private constructor() {}

	/**
	 * シングルトンインスタンスを取得
	 */
	static getInstance(): YouTubeService {
		if (!YouTubeService.instance) {
			YouTubeService.instance = new YouTubeService();
		}
		return YouTubeService.instance;
	}

	/**
	 * Innertubeインスタンスを初期化
	 */
	private async initializeInnertube(): Promise<Innertube> {
		if (!this.innertube) {
			this.innertube = await Innertube.create();
		}
		return this.innertube;
	}

	/**
	 * 動画情報を取得
	 */
	async getVideoInfo(videoId: string): Promise<VideoInfo | null> {
		try {
			const yt = await this.initializeInnertube();
			const videoInfo = await yt.getInfo(videoId);

			if (!videoInfo || !videoInfo.basic_info) return null;

			const info = videoInfo.basic_info;
			return {
				videoId: info.id || '',
				title: info.title || '',
				description: info.short_description || 'No description',
				duration: formatSecondsToTime(info.duration || 0),
				thumbnailUrl: info.thumbnail?.[0]?.url || '',
				iframe: {
					iframeUrl: info.embed?.iframe_url || '',
					iframeHeight: info.embed?.height || 0,
					iframeWidth: info.embed?.width || 0
				},
				keywords: info.keywords || [],
				category: info.category || 'UnCategorized',
				counts: {
					viewCount: info.view_count ? formatCount(Number(info.view_count)) : '0',
					likeCount: info.like_count ? formatCount(Number(info.like_count)) : '0'
				}
			};
		} catch (error) {
			console.error('Error fetching video info:', error instanceof Error ? error.message : error);
			return null;
		}
	}

	/**
	 * プレイリスト情報を取得
	 */
	async getPlaylistInfo(playlistId: string): Promise<PlaylistInfo | null> {
		try {
			const yt = await this.initializeInnertube();
			const playlistInfo = await yt.getPlaylist(playlistId);

			if (!playlistInfo) return null;

			return {
				title: playlistInfo.info.title || '',
				author: {
					name: playlistInfo.info.author?.name || '',
					url: playlistInfo.info.author?.thumbnails?.[0]?.url || '',
					badges: Array.isArray(playlistInfo.info.author?.badges)
						? playlistInfo.info.author.badges.map((badge: any) => badge.text || badge.toString())
						: []
				},
				description: playlistInfo.info.description || 'Description NotFound.',
				itemCount: playlistInfo.info.total_items || '0',
				videos: playlistInfo.items?.map((video: any) => ({
					title: video.title?.text || video.title?.runs?.[0]?.text || 'No title',
					videoId: video.id || '',
					url: `https://www.youtube.com/watch?v=${video.id}`
				})) || []
			};
		} catch (error) {
			console.error('Error fetching playlist info:', error instanceof Error ? error.message : error);
			return null;
		}
	}

	/**
	 * 検索結果を取得
	 */
	async searchVideos(query: string): Promise<SearchInfo[] | null> {
		try {
			const yt = await this.initializeInnertube();
			const searchResults = await yt.search(query, { type: 'video' });

			if (!searchResults?.videos) return null;

			return searchResults.videos.map((result: any) => ({
				videoId: result.id || '',
				title: result.title?.text || result.title || '',
				thumbnail: {
					url: result.thumbnails?.[0]?.url || '',
					width: result.thumbnails?.[0]?.width || 0,
					height: result.thumbnails?.[0]?.height || 0
				},
				author: {
					id: result.author?.url || result.author?.endpoint?.browseEndpoint?.browseId || '',
					name: result.author?.name || '',
					thumbnail: {
						url: result.author?.thumbnails?.[0]?.url || '',
						width: result.author?.thumbnails?.[0]?.width || 0,
						height: result.author?.thumbnails?.[0]?.height || 0
					}
				},
				published: result.published?.text || result.published || '',
				viewCount: result.view_count?.text || result.view_count || '0',
				duration: result.duration?.text || result.duration || '0:00'
			}));
		} catch (error) {
			console.error('Error searching videos:', error instanceof Error ? error.message : error);
			return null;
		}
	}

	/**
	 * 検索候補を取得
	 */
	async getSearchSuggestions(query: string): Promise<string[] | null> {
		try {
			const yt = await this.initializeInnertube();
			const suggestions = await yt.getSearchSuggestions(query);

			if (!suggestions) return null;

			// 最新版の型に対応
			const suggestionTexts: string[] = [];

			// suggestionsがstring[]の場合（レガシー形式）
			if (Array.isArray(suggestions) && typeof suggestions[0] === 'string') {
				return suggestions as string[];
			}

			// suggestionsがObservedArray<SearchSuggestionsSection>の場合
			if (Array.isArray(suggestions)) {
				for (const section of suggestions) {
					if ((section as any).contents) {
						for (const item of (section as any).contents) {
							// SearchSuggestion または HistorySuggestion の場合
							if (item.type === 'SearchSuggestion' || item.type === 'HistorySuggestion') {
								const suggestionText = item.suggestion?.text ||
								                     item.suggestion?.runs?.[0]?.text ||
								                     item.suggestion;
								if (suggestionText) {
									suggestionTexts.push(suggestionText);
								}
							}
						}
					}
				}
			}

			return suggestionTexts.length > 0 ? suggestionTexts : null;
		} catch (error) {
			console.error('Error fetching search suggestions:', error instanceof Error ? error.message : error);
			return null;
		}
	}

	/**
	 * 動画をダウンロード（統合フォーマット優先、フォールバック機能付き）
	 */
	async downloadVideo(videoId: string, type: 'video' | 'audio', quality?: string): Promise<ReadableStream | null> {
		try {
			const yt = await this.initializeInnertube();
			const videoInfo = await yt.getInfo(videoId);

			if (!videoInfo) {
				throw new Error('Video info not found');
			}

			if (type === 'video') {
				// まず video+audio の統合フォーマットを試す
				try {
					const downloadOptions = {
						type: 'video+audio' as const,
						quality: quality || 'best',
						format: 'mp4'
					};

					console.log('Trying video+audio download:', downloadOptions);
					const stream = await videoInfo.download(downloadOptions);

					if (stream) {
						console.log('video+audio download successful');
						return stream;
					}
				} catch (directError) {
					console.warn('video+audio download failed, trying merge approach:', directError);
				}

				// video+audio が失敗した場合、別々にダウンロードして統合を試行
				try {
					console.log('Falling back to separate video+audio download and merge');
					return await this.downloadVideoWithMerge(videoId, quality);
				} catch (mergeError) {
					console.warn('Merge approach also failed:', mergeError);
				}

				// 全て失敗した場合、video+audioで低品質を試行
				console.log('Trying lower quality video+audio as final fallback');
				const fallbackQualities = ['720p', '480p', '360p', '240p'];

				for (const fallbackQuality of fallbackQualities) {
					try {
						const fallbackOptions = {
							type: 'video+audio' as const,
							quality: fallbackQuality,
							format: 'mp4'
						};

						console.log(`Trying fallback quality: ${fallbackQuality}`);
						const stream = await videoInfo.download(fallbackOptions);
						if (stream) {
							console.log(`Fallback successful with quality: ${fallbackQuality}`);
							return stream;
						}
					} catch (fallbackError) {
						console.warn(`Fallback quality ${fallbackQuality} failed:`, fallbackError);
						continue;
					}
				}

				throw new Error('All download methods failed');

			} else {
				// 音声のみの場合は最高音質を選択
				const downloadOptions = {
					type: 'audio' as const,
					quality: quality || 'best',
					format: 'mp4'
				};

				console.log('Audio download options:', downloadOptions);
				return await videoInfo.download(downloadOptions);
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			console.error('Error downloading video:', errorMessage);
			console.error('Full error details:', error);
			throw new Error(`Download failed: ${errorMessage}`);
		}
	}

	/**
	 * 利用可能な動画品質を取得
	 */
	async getAvailableQualities(videoId: string): Promise<{
		video_qualities: string[];
		audio_qualities: string[];
		formats: any[];
	} | null> {
		try {
			const yt = await this.initializeInnertube();
			const videoInfo = await yt.getInfo(videoId);

			if (!videoInfo) {
				return null;
			}

			// Context7ドキュメントに基づいてchooseFormatメソッドを使用して品質を確認
			console.log('Video info available for quality analysis');

			// 基本的な品質オプションを提供
			const standardQualities = ['2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];
			const audioQualities = ['highestaudio', 'bestaudio', 'medium', 'low'];

			// youtubei.jsの内部フォーマット情報にアクセス
			let availableFormats: any[] = [];
			try {
				// videoInfoオブジェクトから利用可能な情報を取得
				const basicInfo = (videoInfo as any).basic_info;
				if (basicInfo) {
					console.log('Basic video info:', {
						title: basicInfo.title,
						duration: basicInfo.duration,
						view_count: basicInfo.view_count
					});
				}

				// streaming_dataから情報を取得
				const streamingData = (videoInfo as any).streaming_data;
				if (streamingData) {
					console.log('Streaming data available');
					availableFormats = [
						...(streamingData.formats || []),
						...(streamingData.adaptive_formats || [])
					];
				}
			} catch (formatError) {
				console.warn('Could not access detailed format information:', formatError);
			}

			return {
				video_qualities: standardQualities,
				audio_qualities: audioQualities,
				formats: availableFormats.map((format: any) => ({
					itag: format.itag,
					mime_type: format.mime_type,
					quality: format.quality,
					quality_label: format.quality_label,
					height: format.height,
					width: format.width,
					fps: format.fps,
					bitrate: format.bitrate,
					has_video: format.has_video,
					has_audio: format.has_audio
				}))
			};
		} catch (error) {
			console.error('Error getting available qualities:', error);
			return null;
		}
	}

	/**
	 * 最適な品質でのダウンロード（高画質音声付き動画用）
	 */
	async downloadVideoOptimized(videoId: string): Promise<ReadableStream | null> {
		try {
			const yt = await this.initializeInnertube();
			const videoInfo = await yt.getInfo(videoId);

			if (!videoInfo) {
				throw new Error('Video info not found');
			}

			// Context7ドキュメントのFormatOptionsインターフェースに基づく設定
			const formatOptions = {
				type: 'video+audio' as const,
				quality: 'best', // 最高品質を選択
				format: 'mp4'
			};

			console.log('Optimized download options:', formatOptions);

			// chooseFormatメソッドを使用して最適なフォーマットを選択
			try {
				const selectedFormat = videoInfo.chooseFormat(formatOptions);
				console.log('Selected format:', {
					itag: selectedFormat.itag,
					quality: selectedFormat.quality_label || selectedFormat.quality,
					mime_type: selectedFormat.mime_type,
					has_video: selectedFormat.has_video,
					has_audio: selectedFormat.has_audio
				});
			} catch (formatError) {
				console.warn('Format selection details not available:', formatError);
			}

			return await videoInfo.download(formatOptions);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			console.error('Error in optimized download:', errorMessage);
			throw new Error(`Optimized download failed: ${errorMessage}`);
		}
	}

	/**
	 * FFmpegを使用してvideoとaudioを統合
	 */
	private mergeVideoAudioWithFFmpeg(videoStream: Readable, audioStream: Readable): Promise<ReadableStream> {
		return new Promise((resolve, reject) => {
			const outputStream = new PassThrough();

			// FFmpegプロセスを起動
			const ffmpegProcess = spawn(ffmpeg.path, [
				'-i', 'pipe:3', // video input
				'-i', 'pipe:4', // audio input
				'-c:v', 'copy', // video codecをコピー（再エンコードしない）
				'-c:a', 'aac',  // audio codecをaacに設定
				'-f', 'mp4',    // output format
				'-movflags', 'frag_keyframe+empty_moov', // ストリーミング用の設定
				'pipe:1'        // output to stdout
			], {
				stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe']
			});

			// video streamをFFmpegに接続（型キャストで解決）
			if (ffmpegProcess.stdio[3]) {
				videoStream.pipe(ffmpegProcess.stdio[3] as NodeJS.WritableStream);
			}

			// audio streamをFFmpegに接続（型キャストで解決）
			if (ffmpegProcess.stdio[4]) {
				audioStream.pipe(ffmpegProcess.stdio[4] as NodeJS.WritableStream);
			}

			// FFmpegの出力をPassThroughストリームに接続
			if (ffmpegProcess.stdout) {
				ffmpegProcess.stdout.pipe(outputStream);
			}

			// エラーハンドリング
			ffmpegProcess.on('error', (error) => {
				console.error('FFmpeg process error:', error);
				reject(new Error(`FFmpeg error: ${error.message}`));
			});

			ffmpegProcess.on('close', (code) => {
				if (code !== 0) {
					console.error(`FFmpeg process exited with code ${code}`);
					reject(new Error(`FFmpeg process failed with exit code ${code}`));
				} else {
					console.log('FFmpeg process completed successfully');
				}
			});

			// stderrのログ出力
			if (ffmpegProcess.stderr) {
				ffmpegProcess.stderr.on('data', (data) => {
					console.log('FFmpeg stderr:', data.toString());
				});
			}

			// ReadableStreamとして返す
			const readableStream = new ReadableStream({
				start(controller) {
					outputStream.on('data', (chunk) => {
						controller.enqueue(new Uint8Array(chunk));
					});

					outputStream.on('end', () => {
						controller.close();
					});

					outputStream.on('error', (error) => {
						controller.error(error);
					});
				},
				cancel() {
					ffmpegProcess.kill();
					outputStream.destroy();
				}
			});

			resolve(readableStream);
		});
	}

	/**
	 * videoとaudioを別々にダウンロードして統合（最高品質優先）
	 */
	async downloadVideoWithMerge(videoId: string, videoQuality?: string, audioQuality?: string): Promise<ReadableStream | null> {
		try {
			const yt = await this.initializeInnertube();
			const videoInfo = await yt.getInfo(videoId);

			if (!videoInfo) {
				throw new Error('Video info not found');
			}

			console.log('Starting separate high-quality video and audio download for merging');

			// 利用可能なフォーマットを確認
			let bestVideoQuality = videoQuality || 'best';
			let bestAudioQuality = audioQuality || 'best';

			// 品質の代替案を用意
			const videoQualityFallbacks = [bestVideoQuality, 'best', '1080p', '720p', '480p', '360p'];
			const audioQualityFallbacks = [bestAudioQuality, 'best', 'bestaudio', 'medium'];

			let videoStream: ReadableStream | null = null;
			let audioStream: ReadableStream | null = null;

			// videoストリームの取得（フォールバック付き）
			for (const quality of videoQualityFallbacks) {
				try {
					const videoOptions = {
						type: 'video' as const,
						quality: quality,
						format: 'mp4'
					};
					console.log(`Trying video download with quality: ${quality}`);
					videoStream = await videoInfo.download(videoOptions);
					if (videoStream) {
						console.log(`Video download successful with quality: ${quality}`);
						break;
					}
				} catch (videoError) {
					console.warn(`Video download failed with quality ${quality}:`, videoError);
					continue;
				}
			}

			// audioストリームの取得（フォールバック付き）
			for (const quality of audioQualityFallbacks) {
				try {
					const audioOptions = {
						type: 'audio' as const,
						quality: quality,
						format: 'mp4'
					};
					console.log(`Trying audio download with quality: ${quality}`);
					audioStream = await videoInfo.download(audioOptions);
					if (audioStream) {
						console.log(`Audio download successful with quality: ${quality}`);
						break;
					}
				} catch (audioError) {
					console.warn(`Audio download failed with quality ${quality}:`, audioError);
					continue;
				}
			}

			if (!videoStream || !audioStream) {
				throw new Error('Failed to get video or audio stream after trying all quality options');
			}

			console.log('Both streams downloaded successfully, starting merge process');

			// ReadableStreamをNode.js Readableに変換
			const videoReadable = Readable.fromWeb(videoStream as any);
			const audioReadable = Readable.fromWeb(audioStream as any);

			// FFmpegで統合
			return await this.mergeVideoAudioWithFFmpeg(videoReadable, audioReadable);

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			console.error('Error in high-quality video merge download:', errorMessage);
			throw new Error(`High-quality video merge download failed: ${errorMessage}`);
		}
	}
}

export const youtubeService = YouTubeService.getInstance();