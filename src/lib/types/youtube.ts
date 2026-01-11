export interface VideoInfo {
	videoId: string;
	title: string;
	description: string;
	duration: string;
	thumbnailUrl: string;
	iframe: {
		iframeUrl: string;
		iframeHeight: number;
		iframeWidth: number;
	};
	keywords: Array<string>;
	category: string;
	counts: {
		viewCount: string;
		likeCount: string;
	};
}

export interface SearchInfo {
	videoId: string;
	title: string;
	thumbnail: Thumbnail;
	author: Author;
	published: string;
	viewCount: string;
	duration: string;
}

export interface PlaylistInfo {
	title: string | undefined;
	author: {
		name: string;
		url: string;
		badges: string[];
	};
	description?: string;
	itemCount: string;
	videos: {
		title: string;
		videoId: string;
		url: string;
	}[];
}

export interface Thumbnail {
	url: string;
	width: number;
	height: number;
}

export interface Author {
	id: string;
	name: string;
	thumbnail: Thumbnail;
}

// 内部利用の型定義
export interface Playlist {
	info: {
		title: string | undefined;
		author: {
			name: string;
			thumbnails: { url: string }[];
			badges: string[];
		};
		description?: string;
		total_items: string;
	};
	videos: {
		title: { runs?: { text: string }[] };
		id: string;
		url: string;
	}[];
}