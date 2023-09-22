<script lang="ts">
	import { Input, Button, TabItem } from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
	export let url: string;
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();
	function Search() {
		dispatch('Query', url);
	}
</script>

<TabItem>
	<div slot="title" class="flex items-center gap-2"><SearchOutline size="xs" />from Search</div>
	<div class="flex flex-col items-center">
		<Input type="text" class="my-2" bind:value={url} placeholder="Relax Music" required />
		<Button on:click={Search} class="gap-1"><SearchOutline size="sm" />Search</Button>
	</div>
</TabItem>
