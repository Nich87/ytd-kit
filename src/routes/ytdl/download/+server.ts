import ytdl from 'ytdl-core';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const id = new URL(url).searchParams.get('v');
	if (!id) throw new Error();
	try {
		const stream = ytdl(id, {
			quality: 'highest',
			filter: (format) => format.container === 'mp4'
		});

		return new Response(stream as any, {
			headers: {
				'Content-Type': 'video/mp4'
			}
		});
	} catch (error) {
		return json(
			{
				error: 'Internal Server Error'
			},
			{
				status: 500
			}
		);
	}
};
