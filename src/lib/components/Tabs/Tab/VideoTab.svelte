<script lang="ts">
	import { Input, Button, TabItem } from 'flowbite-svelte';
	export let url: string;
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();
	function Search() {
		dispatch('Video', url);
	}
</script>

<TabItem open title="from URL">
	<div class="flex flex-col items-center">
		<Input
			type="text"
			class="my-2"
			bind:value={url}
			placeholder="https://www.youtube.com/watch?v=xxxxxxx"
			required
		/>
		<Button on:click={Search}>Search</Button>
	</div>
</TabItem>
