import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import adapterNetlify from '@sveltejs/adapter-netlify';
import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';
import adapterVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: getAdapter({
			edge:true,
			split:false
		}),
		alias: {
			components: 'src/lib/components'
		},
		csp: { mode: 'auto' }
	}
};

function getAdapter(args = {}) {
	if (Object.keys(process.env).some((key) => key.includes('VERCEL'))) {
		return adapterVercel();
	} else if (Object.keys(process.env).some((key) => key.includes('NETLIFY'))) {
		return adapterNetlify(args);
	} else if (Object.keys(process.env).some((key) => key.includes('CF_PAGES'))) {
		return adapterCloudflare();
	} else {
		return process.env.ADAPTER === 'node'
			? adapterNode({ out: 'build' })
			: adapterStatic({
					pages: 'build',
					assets: 'build',
					fallback: null
			  });
	}
}

export default config;
