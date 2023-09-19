<script lang="ts">
	import { Tabs } from 'flowbite-svelte';
	import VideoTab from './Tab/VideoTab.svelte';
	import PlaylistTab from './Tab/PlaylistTab.svelte';
	import SearchTab from './Tab/SearchTab.svelte';
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();

	let url: string;
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

<Tabs>
	<VideoTab {url} on:Video={searchVideoInfo} />
	<PlaylistTab {url} on:Playlist={searchPlaylistInfo} />
	<SearchTab {url} on:Query={searchVideos} />
</Tabs>
