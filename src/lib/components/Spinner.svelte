<script lang="ts">
	import { isLoading } from '$lib/store';
</script>

{#if $isLoading}
	<div
		class="fixed left-0 top-0 z-[1000] flex h-full w-full items-center justify-center bg-black-opacity-80"
	>
		<span class="loading-spinner loading-lg text-info"></span>
	</div>
{/if}
