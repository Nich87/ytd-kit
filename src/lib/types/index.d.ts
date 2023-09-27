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

interface AuthorInfo {
	name: string;
	url: string;
	badges: string[];
}

interface VideoInfo {
	title: string;
	videoId: string;
	url: string;
}

export interface PlaylistInfo {
	title: string;
	author: AuthorInfo;
	description: string;
	itemCount: number;
	videos: VideoInfo[];
}

type Thumbnail = {
	url: string;
	width: number;
	height: number;
};

type Author = {
	id: string;
	name: string;
	thumbnail: Thumbnail;
};

export interface SearchInfo {
	videoId: string;
	title: string;
	thumbnail: Thumbnail;
	author: Author;
	published: string;
	viewCount: string;
	duration: string;
}
