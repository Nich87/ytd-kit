<script lang="ts">
	import { Modal, Button } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { popupRegionErrorModal, togglepopupRegionErrorModal } from '$lib/store';
</script>

{#if popupRegionErrorModal}
	<Modal
		bind:open={$popupRegionErrorModal}
		on:close={() => togglepopupRegionErrorModal()}
		size="xs"
		autoclose
		outsideclose
	>
		<div class="text-center">
			<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				この動画はあなたの地域では利用出来ません。
			</h3>
			<Button color="red" class="mr-2">OK</Button>
		</div>
	</Modal>
{/if}
