const pad = (num: number): string => ('' + num).padStart(2, '0');

/**
 * 秒数を時間形式（HH:MM:SS または MM:SS）に変換
 */
export function formatSecondsToTime(seconds: number | undefined): string {
	if (seconds === undefined) return '00:00:00';
	const hours: number = Math.floor(seconds / 3600);
	seconds %= 3600;
	const minutes: number = Math.floor(seconds / 60);
	seconds %= 60;
	return hours ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * 数値を日本語のコンパクト表記に変換
 */
export function formatCount(count: number | undefined): string {
	if (count === undefined) return '0';
	const views = new Intl.NumberFormat('ja-JP', {
		notation: 'compact'
	}).format(BigInt(count));
	return views;
}