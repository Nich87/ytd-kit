<script lang="ts">
	import PlaylistTab from './Tab/PlaylistTab.svelte';
	import SearchTab from './Tab/SearchTab.svelte';
	import VideoTab from './Tab/VideoTab.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let url: string = '';

	function handleVideo(val: string) {
		dispatch('Video', val);
	}
	function handlePlaylist(val: string) {
		dispatch('Playlist', val);
	}
	function handleQuery(val: string) {
		dispatch('Query', val);
	}
</script>

<div role="tablist" class="tabs-boxed tabs">
	<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="URL" checked />
	<div role="tabpanel" class="tab-content p-10"><VideoTab bind:url onVideo={handleVideo} /></div>

	<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Playlist" />
	<div role="tabpanel" class="tab-content p-10">
		<PlaylistTab bind:url onPlaylist={handlePlaylist} />
	</div>

	<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Search" />
	<div role="tabpanel" class="tab-content p-10"><SearchTab bind:url onQuery={handleQuery} /></div>
</div>
