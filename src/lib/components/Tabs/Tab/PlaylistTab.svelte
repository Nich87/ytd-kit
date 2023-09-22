<script lang="ts">
	import { Input, Button, TabItem } from 'flowbite-svelte';
	import { OrdoredListOutline, SearchOutline } from 'flowbite-svelte-icons';
	export let url: string;
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();
	function Search() {
		dispatch('Playlist', url);
	}
</script>

<TabItem>
	<div slot="title" class="flex items-center gap-2">
		<OrdoredListOutline size="xs" />from Playlist
	</div>
	<div class="flex flex-col items-center">
		<Input
			type="text"
			class="my-2"
			bind:value={url}
			placeholder="https://youtube.com/playlist?list=xxxxxxxx"
			required
		/>
		<Button on:click={Search} class="gap-1"><SearchOutline size="sm" />Search</Button>
	</div>
</TabItem>
