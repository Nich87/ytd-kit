<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.error?.message || 'エラーが発生しました'}</h1>
