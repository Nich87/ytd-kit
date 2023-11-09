<script lang="ts">
	import { onMount } from 'svelte';
	let id: string | null = '';
	onMount(() => {
		document.body.classList.remove('p-4', 'space-y-8', 'container');
		id = new URL(window.location.href).searchParams.get('v');
	});
</script>

{#if id !== null}
	<embed
		src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&muted=1&controls=0&modestbranding=0&loop=1`}
		style="display:block;width:100%;height: 100vh;"
	/>
{/if}
