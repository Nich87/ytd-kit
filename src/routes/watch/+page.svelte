<script lang="ts">
	import { Player, Youtube } from '@vime/svelte';
	import { onMount } from 'svelte';
	let id: string | null = '';
	onMount(() => {
		id = new URL(window.location.href).searchParams.get('v');
	});
</script>

<div id="container">
	<Player controls>
		<Youtube videoId={id} />
	</Player>
</div>

<style>
	#container {
		width: 100%;
		height: 100vh;
	}
</style>
