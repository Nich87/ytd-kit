<script lang="ts">
	import Icon from '@iconify/svelte';
	import { popupRegionErrorModal, togglepopupRegionErrorModal } from '$lib/store';
</script>

{#if $popupRegionErrorModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
		<div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
			<div class="mb-4 flex justify-center">
				<Icon icon="mdi:alert-circle" class="h-12 w-12 text-red-500" />
			</div>
			<h3 class="mb-4 text-center text-lg font-normal text-gray-500 dark:text-gray-400">
				この動画はあなたの地域では利用出来ません。
			</h3>
			<div class="flex justify-center">
				<button class="btn btn-error" on:click={() => togglepopupRegionErrorModal()}> OK </button>
			</div>
		</div>
	</div>
{/if}
