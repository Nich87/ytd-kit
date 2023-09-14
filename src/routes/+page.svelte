<script lang="ts">
	import { Input, Button, Tabs, TabItem, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import { VideoSolid, FileMusicSolid } from 'flowbite-svelte-icons';
	const videoRegex =
		/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/gim;
	let url: string;
	let info: {
		formats: [
			{
				hasAudio: boolean;
				hasVideo: boolean;
				url: string;
				qualityLabel: string;
				mimeType: string;
			}
		];
		videoDetails: {
			title: string;
		};
	};

	let playlistInfo: {
		title: string;
		author: {
			name: string;
			url: string;
			avatars: [
				{
					url: string;
					width: number;
					height: number;
				}
			];
			bestAvatar: {
				url: string;
				width: number;
				height: number;
			};
			channelID: string;
		};
		description: string;
		itemCount: number;
		videos: [
			{
				title: string;
				videoId: string;
				url: string;
			}
		];
	};

	function fetchType(format: (typeof info.formats)[0]) {
		const has =
			format.hasAudio && format.hasVideo
				? 'Audio and Video'
				: format.hasAudio
				? 'Audio only'
				: format.hasVideo
				? 'Video only'
				: 'No Audio or Video';
		const mimeType = format.mimeType ? format.mimeType.split(';')[0] : '';

		return `${has} (${mimeType})`;
	}

	function formatWithAudioVideo(data: typeof info) {
		return data.formats.filter((f) => f.hasAudio && f.hasVideo)[0].url;
	}

	async function searchVideoInfo() {
		const video_url = videoRegex.test(url) ? url : null;
		if (!video_url) return;

		const reponse = await fetch(`/ytdl/info?video_url=${video_url}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		if (reponse.status !== 200) return console.error(reponse.status, reponse);
		info = await reponse.json();
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

	async function downloadVideo(url: string, videoId: string) {
		const response = await fetch(`/ytdl/download?v=${url}`, {
			method: 'GET',
			headers: {
				'content-type': 'video/mp4'
			}
		});
		if (response.status !== 200) return console.error(response.status, response);
		const blob = await response.blob();
		const _url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = _url;
		a.download = `${videoId}.mp4`;
		document.body.appendChild(a);
		a.click();
		a.remove();
	}
</script>

<div class="mx-auto flex flex-col justify-center items-center px-6 pt-8 pt:mt-0">
	<div class="border-solid border-2 border-sky-500">
		<Tabs>
			<TabItem open title="from URL">
				<Input
					type="text"
					bind:value={url}
					placeholder="https://www.youtube.com/watch?v=xxxxxxx"
					pattern="^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$"
					required
				/>
				<Button on:click={searchVideoInfo}>Search</Button>
			</TabItem>

			<TabItem title="from Search">
				<Input type="text" bind:value={url} placeholder="君に届け OP" required />
				<Button on:click={searchVideoInfo}>Search</Button>
			</TabItem>

			<TabItem title="from Playlist">
				<Input
					type="text"
					bind:value={url}
					placeholder="https://youtube.com/playlist?list=xxxxxxxx"
					required
				/>
				<Button on:click={searchPlaylistInfo}>Search</Button>
			</TabItem>
		</Tabs>
	</div>
</div>

{#if info}
	<div class="flex justify-center items-center flex-col">
		<div>
			<!-- svelte-ignore a11y-media-has-caption -->
			<video src={formatWithAudioVideo(info)} autoplay controls />
			<h1>{info.videoDetails.title}</h1>
		</div>
		<div class="border-solid border-2 border-red-500">
			<Listgroup>
				{#each info.formats as format}
					<ListgroupItem
						><a href={format.url} rel="noreferer"
							>{fetchType(format)}:{format.qualityLabel ? format.qualityLabel : ''}</a
						></ListgroupItem
					>
				{/each}
			</Listgroup>
		</div>
	</div>
{/if}

{#if playlistInfo}
	<div class="flex justify-center items-center">
		<img
			src={playlistInfo.author.bestAvatar.url}
			width={playlistInfo.author.bestAvatar.width}
			height={playlistInfo.author.bestAvatar.height}
			alt="CoverImage"
		/>
		<div>
			<p>Playlist:{playlistInfo.title}</p>
			<p>Author:{playlistInfo.author.name} | item:{playlistInfo.itemCount}</p>
		</div>
	</div>
	<div class="border-solid border-2 border-red-500">
		<Listgroup>
			{#each playlistInfo.videos as video}
				<ListgroupItem class="flex">
					<a href={video.url} class="m-1">{video.title}</a>
					<VideoSolid class="m-1" on:click={() => downloadVideo(video.url, video.videoId)} />
					<FileMusicSolid class="m-1" />
				</ListgroupItem>
			{/each}
		</Listgroup>
	</div>
{/if}
