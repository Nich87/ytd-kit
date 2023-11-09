<script lang="ts">
	import { Embed } from '@vime/svelte';
	import { onMount } from 'svelte';
	let id: string | null = '';
	onMount(() => {
		id = new URL(window.location.href).searchParams.get('v');
	});

	const params = {
		autoplay: 1,
		muted: 1,
		controls: 0
	};
</script>

{#if id !== null}
	<div id="container">
		<Embed
			embedSrc={`https://www.youtube-nocookie.com/embed/${id}`}
			origin="https://www.youtube-nocookie.com"
			{params}
		/>
	</div>
{/if}
