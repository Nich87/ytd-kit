<script lang="ts">
	import Icon from '@iconify/svelte';

	let { url = $bindable(), onPlaylist } = $props();

	function Search() {
		onPlaylist?.(url);
	}
</script>

<div class="tab-item">
	<!-- Tab title -->
	<div class="flex items-center gap-2">
		<Icon icon="mdi:playlist-music" class="text-xl" />
		<!-- Using Iconify for Playlist icon -->
		From Playlist
	</div>

	<!-- Tab content -->
	<div class="flex flex-col items-center p-4">
		<!-- Input field for Playlist URL -->
		<input
			type="text"
			class="input input-bordered my-2 w-full max-w-md"
			bind:value={url}
			placeholder="https://youtube.com/playlist?list=xxxxxxxx"
			required
		/>

		<!-- Search button -->
		<button onclick={Search} class="btn btn-primary flex items-center gap-2">
			<Icon icon="mdi:magnify" class="text-xl" />
			<!-- Using Iconify for Search icon -->
			Search
		</button>
	</div>
</div>
