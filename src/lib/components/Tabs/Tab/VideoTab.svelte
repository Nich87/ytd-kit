<script lang="ts">
	import { Input, Button, TabItem } from 'flowbite-svelte';
	import { LinkOutline, SearchOutline } from 'flowbite-svelte-icons';
	export let url: string;
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();
	function Search() {
		dispatch('Video', url);
	}
</script>

<TabItem open>
	<div slot="title" class="flex items-center gap-2"><LinkOutline size="xs" />from URL</div>
	<div class="flex flex-col items-center">
		<Input
			type="text"
			class="my-2"
			bind:value={url}
			placeholder="https://www.youtube.com/watch?v=xxxxxxx"
			required
		/>
		<Button on:click={Search} class="gap-1"><SearchOutline size="sm" />Search</Button>
	</div>
</TabItem>
