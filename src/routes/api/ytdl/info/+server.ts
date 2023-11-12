import { formatSecondsToTime, formatCount } from '$lib/formatter';
import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';
import { Innertube } from 'youtubei.js';

const ytdl = await Innertube.create();

async function getInfo(id: string) {
	try {
		return await ytdl.getInfo(id);
	} catch (error) {
		return null;
	}
}

export const GET = (async ({ url }: { url: URL }) => {
	const id = new URL(url).searchParams.get('id');
	if (!id)
		return json(
			{
				error: 'No videoId'
			},
			{ status: 404 }
		);

	const videoInfo = await getInfo(id);
	if (!videoInfo) return json({ error: 'videoInfo NotFound' }, { status: 404 });
	const info = videoInfo.basic_info;
	const basicInfo = {
		videoId: info.id,
		title: info.title,
		description: info.short_description ? info.short_description : 'No description',
		duration: formatSecondsToTime(info.duration),
		thumbnailUrl: info.thumbnail?.[0].url,
		iframe: {
			iframeUrl: info.embed?.iframe_url,
			iframeHeight: info.embed?.height as number | undefined,
			iframeWidth: info.embed?.width as number | undefined
		},
		keywords: info.keywords ? info.keywords : [],
		category: info.category ? info.category : 'UnCategorized',
		counts: {
			viewCount: info.view_count ? formatCount(info.view_count) : '0',
			likeCount: info.like_count ? formatCount(info.like_count) : '0'
		}
	};

	return json(basicInfo);
}) satisfies RequestHandler;
