<script lang="ts">
	import { Modal, Button } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { popupUrlErrorModal, togglepopupUrlErrorModal } from '$lib/store';
</script>

{#if popupUrlErrorModal}
	<Modal
		bind:open={$popupUrlErrorModal}
		on:close={() => togglepopupUrlErrorModal}
		size="xs"
		autoclose
		outsideclose
	>
		<div class="text-center">
			<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				不正なURLです。修正し再度お試しください。
			</h3>
			<Button color="red" class="mr-2">OK</Button>
		</div>
	</Modal>
{/if}
