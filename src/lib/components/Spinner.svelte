<script lang="ts">
	import { Spinner } from 'flowbite-svelte';
	export let isLoading = false;
</script>

{#if isLoading}
	<div
		class="fixed flex justify-center items-center top-0 left-0 w-full h-full z-[1000] bg-black-opacity-80"
	>
		<Spinner size={'16'} />
	</div>
{/if}
