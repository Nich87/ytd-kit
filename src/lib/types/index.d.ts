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

export interface PlaylistInfo {
	title: string;
	author: {
		name: string;
		url: string;
		avatars: [
			{
				url: string;
				width: number;
				height: number;
			}
		];
		bestAvatar: {
			url: string;
			width: number;
			height: number;
		};
		channelID: string;
	};
	description: string;
	itemCount: number;
	videos: [
		{
			title: string;
			videoId: string;
			url: string;
		}
	];
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
