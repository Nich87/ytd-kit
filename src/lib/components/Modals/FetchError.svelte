<script lang="ts">
	import { Modal, Button } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { popupFetchErrorModal } from '$lib/store';
</script>

{#if popupFetchErrorModal}
	<Modal bind:open={$popupFetchErrorModal} size="xs" autoclose outsideclose>
		<div class="text-center">
			<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				動画情報を取得出来ませんでした。再度URLを確認しリトライしてください。
			</h3>
			<Button color="red" class="mr-2">OK</Button>
		</div>
	</Modal>
{/if}
