export function parseVideoUrl(url: string | undefined): string | null {
	if (url === undefined) return null;
	if (!url.startsWith('https://')) url = 'https://' + url;
	try {
		const parsed = new URL(url);
		const [, one, two] = parsed.pathname.split('/');
		if (parsed.hostname === 'youtu.be') return one;

		const [com, youtube] = parsed.hostname.split('.').reverse();
		if (com !== 'com' || youtube !== 'youtube') return null;

		switch (one) {
			case 'v':
			case 'videos':
			case 'embed':
			case 'shorts':
				return two;
			case 'watch':
				return parsed.searchParams.get('v');
		}
		return parsed.searchParams.get('v');
	} catch (e) {
		console.error(e);
		return null;
	}
}
