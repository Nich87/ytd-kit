<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import VideoTab from './Tab/VideoTab.svelte';
	import PlaylistTab from './Tab/PlaylistTab.svelte';
	import SearchTab from './Tab/SearchTab.svelte';

	let dispatch = createEventDispatcher();
	let url: string;

	// Dispatch events for each tab
	function searchVideoInfo(e: CustomEvent) {
		dispatch('Video', e.detail);
	}
	function searchPlaylistInfo(e: CustomEvent) {
		dispatch('Playlist', e.detail);
	}
	function searchVideos(e: CustomEvent) {
		dispatch('Query', e.detail);
	}
</script>

<!--
<div role="tablist" class="tabs-boxed tabs">
	<div role="tab" class="tab">
		<VideoTab {url} on:Video={searchVideoInfo} />
	</div>
	<div role="tab" class="tab tab-active">
		<PlaylistTab {url} on:Playlist={searchPlaylistInfo} />
	</div>
	<div role="tab" class="tab">
		<SearchTab {url} on:Query={searchVideos} />
	</div>
</div> -->

<div role="tablist" class="tabs-boxed tabs">
	<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="URL" checked />
	<div role="tabpanel" class="tab-content p-10"><VideoTab {url} on:Video={searchVideoInfo} /></div>

	<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Playlist" />
	<div role="tabpanel" class="tab-content p-10">
		<PlaylistTab {url} on:Playlist={searchPlaylistInfo} />
	</div>

	<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Search" />
	<div role="tabpanel" class="tab-content p-10"><SearchTab {url} on:Query={searchVideos} /></div>
</div>
