<script lang="ts">
	import { Input, Button, TabItem } from 'flowbite-svelte';
	export let searchVideoInfo;
	export let url: string;
</script>

<TabItem title="from Search" disabled>
	<div class="flex flex-col items-center">
		<Input type="text" class="my-2" bind:value={url} placeholder="Relax Music" required />
		<Button on:click={searchVideoInfo}>Search</Button>
	</div>
</TabItem>
