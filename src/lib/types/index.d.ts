export type VideoInfo = {
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
};

export type PlaylistInfo = {
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
};
