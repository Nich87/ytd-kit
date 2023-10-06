<script lang="ts">
	import { Spinner } from 'flowbite-svelte';
	import { isLoading } from '$lib/store';
	let size = "16";
</script>

{#if $isLoading}
	<div
		class="fixed flex justify-center items-center top-0 left-0 w-full h-full z-[1000] bg-black-opacity-80"
	>
		<Spinner {size} />
	</div>
{/if}
