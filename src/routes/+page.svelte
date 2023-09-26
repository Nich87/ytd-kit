<script lang="ts">
	import {
		Button,
		Listgroup,
		ListgroupItem,
		Badge,
		Blockquote,
		P,
		Hr,
		Avatar,
		Card
	} from 'flowbite-svelte';
	import { VideoSolid, FileMusicSolid, SearchOutline } from 'flowbite-svelte-icons';
	import { toggleLoadingState, togglepopupUrlErrorModal, togglepopupFetchModal,togglepopupRegionErrorModal } from '$lib/store';
	import { parseVideoUrl } from '$lib/parseURL';
	import type { VideoInfo, PlaylistInfo, SearchInfo } from '$lib/types/index';
	import Header from 'components/Header.svelte';
	import Footer from 'components/Footer.svelte';
	import URLErrorModal from 'components/Modals/URLError.svelte';
	import FetchErrorModal from 'components/Modals/FetchError.svelte';
	import MainTabs from 'components/Tabs/index.svelte';
	import Spinner from 'components/Spinner.svelte';
	let url: string;
	let videoInfo: VideoInfo;
	let playlistInfo: PlaylistInfo;
	let searchInfo: SearchInfo;

	async function searchVideoInfo() {
		const video_url = parseVideoUrl(url);
		if (!video_url) return togglepopupUrlErrorModal();

		const response = await fetch(`/api/ytdl/info?id=${video_url}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		toggleLoadingState();
		if (response.status !== 200) {
			togglepopupFetchModal();
			return console.error(response.status, response);
		}
		videoInfo = await response.json();
		toggleLoadingState();
	}

	async function searchPlaylistInfo() {
		const video_url = url;
		if (!video_url) return togglepopupUrlErrorModal();

		const response = await fetch(`/api/ytpl/videos?video_url=${video_url}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		toggleLoadingState();
		if (response.status !== 200) {
			togglepopupFetchModal();
			return console.error(response.status, response);
		}
		playlistInfo = await response.json();
		toggleLoadingState();
	}

	async function searchQueryInfo() {
		const query = url;
		if (!query) return togglepopupUrlErrorModal();

		const response = await fetch(`/api/ytdl/search?q=${query}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		toggleLoadingState();
		if (response.status !== 200) {
			togglepopupFetchModal();
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
			json.errorobj.info.error_type === "UNPLAYABLE" ? togglepopupRegionErrorModal() : togglepopupFetchModal();
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

<div class="max-w-3xl mx-auto border-solid border-2 border-sky-500 p-4">
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
	<div class="max-w-3xl mx-auto mt-8">
		<div class="flex justify-center space-x-4">
			<Button on:click={() => downloadVideo(videoInfo.videoId, 'video')}
				><VideoSolid class="m-1" />
				Download Video</Button
			>
			<Button on:click={() => downloadVideo(videoInfo.videoId, 'audio')}
				><FileMusicSolid class="m-1" />Download Audio</Button
			>
		</div>
		<Hr class="my-4" />
		<div>
			<iframe
				title={videoInfo.title}
				src={videoInfo.iframe.iframeUrl}
				width="100%"
				height={videoInfo.iframe.iframeHeight}
			/>
			<P size="2xl" weight="semibold">{videoInfo.title}</P>
			<P size="xl" weight="semibold">Category: {videoInfo.category}</P>
			<P size="xl" weight="semibold">👀 {videoInfo.counts.viewCount}</P>
			<P size="xl" weight="semibold">👍 {videoInfo.counts.likeCount}</P>
			<Hr class="my-4" />
			<Blockquote border bg class="p-4 overflow-auto">
				<pre class="whitespace-pre-wrap">{videoInfo.description}</pre>
			</Blockquote>

			<Hr class="my-4" />
			<div class="flex flex-wrap items-center">
				{#each videoInfo.keywords as keyword}
					<Badge
						border
						color="red"
						href="https://www.youtube.com/results?search_query={keyword}"
						rel="noopener noreferrer"
						target="_blank"
						class="mr-2 mb-2"><SearchOutline class="w-2.5 h-2.5 mr-1.5" />{keyword}</Badge
					>
				{/each}
			</div>
		</div>
	</div>
{/if}

{#if playlistInfo}
	<div class="max-w-3xl mx-auto mt-8">
		<div class="flex flex-col items-center">
			<img
				src={playlistInfo.author.bestAvatar.url}
				width={playlistInfo.author.bestAvatar.width}
				height={playlistInfo.author.bestAvatar.height}
				alt="CoverImage"
			/>
			<div>
				<P>Playlist: {playlistInfo.title}</P>
				<P>Author: {playlistInfo.author.name} | item: {playlistInfo.itemCount}</P>
			</div>
		</div>
		<div class="border-solid border-2 border-red-500 mt-4">
			<Listgroup>
				{#each playlistInfo.videos as video}
					<ListgroupItem class="flex items-center space-between">
						<a href={video.url} class="m-1 flex-grow">{video.title}</a>
						<div class="flex flex-end">
							<VideoSolid class="m-1" on:click={() => downloadVideo(video.videoId, 'video')} />
							<FileMusicSolid class="m-1" on:click={() => downloadVideo(video.videoId, 'audio')} />
						</div>
					</ListgroupItem>
				{/each}
			</Listgroup>
		</div>
	</div>
{/if}

{#if searchInfo}
	<!-- TODO:add Badge -->
	<div class="grid grid-cols-1 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
		{#each searchInfo as entry}
			{#if entry?.videoId}
				<div class="flex flex-col items-center h-full">
					<Card img={entry.thumbnail.url} class="mb-4">
						<h5
							class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1"
						>
							<a href="https://www.youtube.com/watch?v={entry.videoId}">{entry.title}</a>
						</h5>
						<div class="flex items-center space-x-4">
							<Avatar src={entry.author.thumbnail.url} rounded />
							<div class="space-y-1 font-medium dark:text-white">
								<div class="line-clamp-1">{entry.author.name}</div>
								<div class="text-sm text-gray-500 dark:text-gray-400">
									Published at {entry.published ? entry.published : 'unknown'}
								</div>
							</div>
						</div>
						<div class="text-sm text-gray-500 dark:text-gray-400">
							{entry.viewCount} | {entry.duration}
						</div>
					</Card>
					<div class="flex justify-center space-x-4">
						<Button on:click={() => downloadVideo(entry.videoId, 'video')}>
							<VideoSolid class="m-1" />
							Download Video
						</Button>
						<Button on:click={() => downloadVideo(entry.videoId, 'audio')}>
							<FileMusicSolid class="m-1" />
							Download Audio
						</Button>
					</div>
				</div>
			{/if}
		{/each}
	</div>
{/if}

<FetchErrorModal />
<URLErrorModal />

<Footer />
