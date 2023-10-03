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


export interface Playlist {
	info:{
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
    id:string;
	url:string;
  }[];
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
    title: { runs?: { text: string }[] };
    videoId:string;
	url:string;
  }[];
}