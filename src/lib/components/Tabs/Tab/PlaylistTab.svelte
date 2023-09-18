<script lang="ts">
	import { Input, Button, TabItem } from 'flowbite-svelte';
	export let url: string;
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();
	function Search() {
		dispatch('Playlist', url);
	}
</script>

<TabItem title="from Playlist">
	<div class="flex flex-col items-center">
		<Input
			type="text"
			class="my-2"
			bind:value={url}
			placeholder="https://youtube.com/playlist?list=xxxxxxxx"
			required
		/>
		<Button on:click={Search}>Search</Button>
	</div>
</TabItem>
