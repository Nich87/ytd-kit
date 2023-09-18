<script lang="ts">
	import {
		Input,
		Button,
		Tabs,
		TabItem,
		Listgroup,
		ListgroupItem,
		Modal,
		Badge,
		Blockquote,
		P,
		Hr
	} from 'flowbite-svelte';
	import {
		VideoSolid,
		FileMusicSolid,
		ExclamationCircleOutline,
		SearchOutline
	} from 'flowbite-svelte-icons';
	import type { VideoInfo, PlaylistInfo } from '$lib/types/index';
	let popupModal = false;
	//TODO: Playlistの正規表現の追加。動画単体だと、youtu.be/xxxx?si=xxxxのようなURLにも対応必要(特にモバイルは共有ボタンからだとほぼそれ)
	const videoRegex =
		/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/gim;
	let url: string;
	let videoInfo: VideoInfo;
	let playlistInfo: PlaylistInfo;

	async function searchVideoInfo() {
		const video_url = videoRegex.test(url) ? url : null;
		if (!video_url) return (popupModal = true);

		const reponse = await fetch(`/ytdl/info?video_url=${video_url}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		if (reponse.status !== 200) return console.error(reponse.status, reponse);
		videoInfo = await reponse.json();
	}

	async function searchPlaylistInfo() {
		const video_url = url;
		if (!video_url) return;

		const response = await fetch(`/ytpl/videos?video_url=${video_url}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.status !== 200) return console.error(response.status, response);
		playlistInfo = await response.json();
	}

	async function downloadVideo(videoId: string, downloadType: string) {
		const response = await fetch(`/ytdl/download?v=${videoId}&type=${downloadType}`, {
			method: 'GET',
			headers: {
				'content-type': downloadType === 'video' ? 'video/mp4' : 'audio/mpeg'
			}
		});
		if (response.status !== 200) return console.error(response.status, response);
		const blob = await response.blob();
		const _url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = _url;
		a.download = `${videoId}.${downloadType === 'video' ? 'mp4' : 'mp3'}`;
		document.body.appendChild(a);
		a.click();
		a.remove();
	}
</script>

<div class="container mx-auto p-4">
	<div class="max-w-3xl mx-auto border-solid border-2 border-sky-500 p-4">
		<Tabs>
			<TabItem open title="from URL">
				<div class="flex flex-col items-center">
					<Input
						type="text"
						bind:value={url}
						placeholder="https://www.youtube.com/watch?v=xxxxxxx"
						pattern="^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$"
						required
					/>
					<Button on:click={searchVideoInfo}>Search</Button>
				</div>
			</TabItem>

			<TabItem title="from Search">
				<div class="flex flex-col items-center">
					<Input type="text" bind:value={url} placeholder="君に届け OP" required />
					<Button on:click={searchVideoInfo}>Search</Button>
				</div>
			</TabItem>

			<TabItem title="from Playlist">
				<div class="flex flex-col items-center">
					<Input
						type="text"
						bind:value={url}
						placeholder="https://youtube.com/playlist?list=xxxxxxxx"
						required
					/>
					<Button on:click={searchPlaylistInfo}>Search</Button>
				</div>
			</TabItem>
		</Tabs>
	</div>

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
					<p>Playlist: {playlistInfo.title}</p>
					<p>Author: {playlistInfo.author.name} | item: {playlistInfo.itemCount}</p>
				</div>
			</div>
			<div class="border-solid border-2 border-red-500 mt-4">
				<Listgroup>
					{#each playlistInfo.videos as video}
						<ListgroupItem class="flex items-center">
							<a href={video.url} class="m-1">{video.title}</a>
							<VideoSolid class="m-1" on:click={() => downloadVideo(video.videoId, 'video')} />
							<FileMusicSolid class="m-1" on:click={() => downloadVideo(video.videoId, 'audio')} />
						</ListgroupItem>
					{/each}
				</Listgroup>
			</div>
		</div>
	{/if}

	{#if popupModal}
		<Modal bind:open={popupModal} size="xs" autoclose outsideclose>
			<div class="text-center">
				<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					不正なURLです。修正し再度お試しください。
				</h3>
				<Button color="red" class="mr-2">OK</Button>
			</div>
		</Modal>
	{/if}
</div>
