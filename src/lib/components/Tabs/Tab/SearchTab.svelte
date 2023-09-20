<script lang="ts">
	import { Input, Button, TabItem } from 'flowbite-svelte';
	export let url: string;
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();
	function Search() {
		dispatch('Query', url);
	}
</script>

<TabItem title="from Search">
	<div class="flex flex-col items-center">
		<Input type="text" class="my-2" bind:value={url} placeholder="Relax Music" required />
		<Button on:click={Search}>Search</Button>
	</div>
</TabItem>
