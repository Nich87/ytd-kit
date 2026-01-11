/**
 * YouTube URLから動画IDを抽出
 * 様々なYouTube URL形式に対応
 */
export function parseVideoUrl(url: string | null): string {
	if (url === null) return '';
	if (!url.startsWith('https://')) url = 'https://' + url;

	try {
		const parsed = new URL(url);
		const [, one, two] = parsed.pathname.split('/');

		// youtu.be形式の短縮URL
		if (parsed.hostname === 'youtu.be') return one;

		// youtube.comドメインチェック
		const [com, youtube] = parsed.hostname.split('.').reverse();
		if (com !== 'com' || youtube !== 'youtube') return '';

		// パス別の処理
		switch (one) {
			case 'v':
			case 'videos':
			case 'embed':
			case 'shorts':
				return two;
			case 'watch':
				return parsed.searchParams.get('v') as string;
		}

		// クエリパラメータから取得
		return parsed.searchParams.get('v') as string;
	} catch (e) {
		console.error('URL parsing error:', e);
		return '';
	}
}

/**
 * YouTube プレイリストURLからプレイリストIDを抽出
 */
export function parsePlaylistUrl(url: string): string | null {
	try {
		const parsed = new URL(url);
		return parsed.searchParams.get('list');
	} catch (e) {
		console.error('Playlist URL parsing error:', e);
		return null;
	}
}