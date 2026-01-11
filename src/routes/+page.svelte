<script lang="ts">
	import MainTabs from '$lib/components/features/tabs/index.svelte';
	import Footer from '$lib/components/ui/Footer.svelte';
	import Header from '$lib/components/ui/Header.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import FetchErrorModal from '$lib/components/ui/modals/FetchError.svelte';
	import RegionError from '$lib/components/ui/modals/RegionError.svelte';
	import URLErrorModal from '$lib/components/ui/modals/URLError.svelte';
	import {
		toggleLoadingState,
		openUrlErrorModal,
		toggleFetchErrorModal,
		toggleRegionErrorModal
	} from '$lib/stores/ui';
	import type { VideoInfo, PlaylistInfo, SearchInfo } from '$lib/types/youtube';
	import { parseVideoUrl } from '$lib/utils/url-parser';
	import Icon from '@iconify/svelte';

	let url: string;
	let videoInfo: VideoInfo;
	let playlistInfo: PlaylistInfo;
	let searchInfo: SearchInfo[];

	async function searchVideoInfo() {
		const videoUrl = parseVideoUrl(url);
		if (!videoUrl) return openUrlErrorModal();

		const response = await fetch(`/api/ytdl/info?id=${videoUrl}`, {
			method: 'GET',
			headers: { 'content-type': 'application/json' }
		});
		toggleLoadingState();
		if (response.status !== 200) {
			toggleLoadingState();
			toggleFetchErrorModal();
			return console.error(response.status, response);
		}
		videoInfo = await response.json();
		toggleLoadingState();
	}

	async function searchPlaylistInfo() {
		const playlistUrl = url;
		if (!playlistUrl) return openUrlErrorModal();

		const response = await fetch(`/api/ytdl/playlist?url=${playlistUrl}`, {
			method: 'GET',
			headers: { 'content-type': 'application/json' }
		});
		toggleLoadingState();
		if (response.status !== 200) {
			toggleLoadingState();
			toggleFetchErrorModal();
			return console.error(response.status, response);
		}
		playlistInfo = await response.json();
		toggleLoadingState();
	}

	async function searchQueryInfo() {
		const query = url;
		if (!query) return openUrlErrorModal();

		const response = await fetch(`/api/ytdl/search?q=${query}`, {
			method: 'GET',
			headers: { 'content-type': 'application/json' }
		});
		toggleLoadingState();
		if (response.status !== 200) {
			toggleLoadingState();
			toggleFetchErrorModal();
			return console.error(response.status, response);
		}
		searchInfo = await response.json();
		toggleLoadingState();
	}

	async function downloadVideo(videoId: string, downloadType: string) {
		const response = await fetch(`/api/ytdl/download?v=${videoId}&type=${downloadType}`, {
			method: 'GET',
			headers: {
				'content-type': downloadType === 'video' ? 'video/mp4' : 'audio/mpeg'
			}
		});
		toggleLoadingState();
		if (response.status !== 200) {
			let json = await response.json();
			json.errorobj.info.error_type === 'UNPLAYABLE'
				? toggleRegionErrorModal()
				: toggleFetchErrorModal();
			toggleLoadingState();
			return console.error(response.status, response);
		}
		const blob = await response.blob();
		toggleLoadingState();
		const _url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = _url;
		a.download = `${videoId}.${downloadType === 'video' ? 'mp4' : 'mp3'}`;
		document.body.appendChild(a);
		a.click();
		a.remove();
	}
</script>

<Header />

<div class="mx-auto max-w-4xl p-4">
	<MainTabs
		on:Video={(e) => {
			url = e.detail;
			searchVideoInfo();
		}}
		on:Playlist={(e) => {
			url = e.detail;
			searchPlaylistInfo();
		}}
		on:Query={(e) => {
			url = e.detail;
			searchQueryInfo();
		}}
	/>
</div>

<Spinner />

{#if videoInfo}
	<div class="mx-auto mt-8 max-w-3xl">
		<div class="flex justify-center space-x-4">
			<button class="btn btn-primary" onclick={() => downloadVideo(videoInfo.videoId, 'video')}>
				<Icon icon="mdi:video" class="m-1" /> Download Video
			</button>
			<button class="btn btn-secondary" onclick={() => downloadVideo(videoInfo.videoId, 'audio')}>
				<Icon icon="mdi:file-music" class="m-1" /> Download Audio
			</button>
		</div>

		<hr class="my-4" />

		<iframe
			title={videoInfo.title}
			src={videoInfo.iframe.iframeUrl}
			width="100%"
			height={videoInfo.iframe.iframeHeight}
		></iframe>
		<p class="text-2xl font-semibold">{videoInfo.title}</p>
		<p class="text-xl font-semibold">Category: {videoInfo.category}</p>
		<p class="text-xl font-semibold">👀 {videoInfo.counts.viewCount}</p>
		<p class="text-xl font-semibold">👍 {videoInfo.counts.likeCount}</p>

		<hr class="my-4" />

		<blockquote class="overflow-auto border-l-4 border-gray-500 bg-gray-100 p-4">
			<pre class="whitespace-pre-wrap">{videoInfo.description}</pre>
		</blockquote>

		<hr class="my-4" />

		<div class="flex flex-wrap items-center">
			{#each videoInfo.keywords as keyword}
				<a
					href="https://www.youtube.com/results?search_query={keyword}"
					target="_blank"
					class="badge badge-error mb-2 mr-2"
				>
					<Icon icon="mdi:magnify" class="mr-1.5 h-2.5 w-2.5" />
					{keyword}
				</a>
			{/each}
		</div>
	</div>
{/if}

{#if playlistInfo}
	<div class="mx-auto mt-8 max-w-3xl">
		<div class="flex flex-col items-center">
			<img src={playlistInfo.author.url} alt="CoverImage" class="h-32 w-32 object-cover" />
			<div class="mt-4 text-center">
				<p class="text-lg">Playlist: {playlistInfo.title}</p>
				<p class="text-sm">
					Author: {playlistInfo.author.name} | itemCount: {playlistInfo.itemCount}
				</p>
			</div>
		</div>
		<div class="mt-4 border border-red-500 p-2">
			<ul class="list-none">
				{#each playlistInfo.videos as video}
					<li class="flex justify-between border-b p-2">
						<a href={video.url} class="flex-grow">{video.title}</a>
						<div class="flex">
							<Icon
								icon="mdi:video"
								class="m-1"
								onclick={() => downloadVideo(video.videoId, 'video')}
							/>
							<Icon
								icon="mdi:file-music"
								class="m-1"
								onclick={() => downloadVideo(video.videoId, 'audio')}
							/>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}

{#if searchInfo}
	<div class="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each searchInfo as entry}
			{#if entry?.videoId}
				<div class="flex h-full flex-col items-center">
					<div class="card flex w-full flex-col bg-base-100 shadow-xl">
						<figure>
							<img src={entry.thumbnail.url} alt="thumbnail" class="object-cover" />
						</figure>
						<div class="card-body flex-1">
							<h2 class="card-title truncate">{entry.title}</h2>
							<p>Published at {entry.published ? entry.published : 'unknown'}</p>
							<p>Views: {entry.viewCount}</p>
							<p>Duration: {entry.duration}</p>
						</div>
					</div>
					<div class="mt-2 flex space-x-2">
						<button
							class="btn btn-primary px-2 py-1 text-sm"
							onclick={() => downloadVideo(entry.videoId, 'video')}
						>
							<Icon icon="mdi:video" class="mr-1" /> Download Video
						</button>
						<button
							class="btn btn-secondary px-2 py-1 text-sm"
							onclick={() => downloadVideo(entry.videoId, 'audio')}
						>
							<Icon icon="mdi:file-music" class="mr-1" /> Download Audio
						</button>
					</div>
				</div>
			{/if}
		{/each}
	</div>
{/if}

<RegionError />
<FetchErrorModal />
<URLErrorModal />

<Footer />
