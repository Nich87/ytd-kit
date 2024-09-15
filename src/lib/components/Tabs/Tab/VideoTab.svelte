<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte'; // If using Iconify
	export let url: string;
	let dispatch = createEventDispatcher();

	function Search() {
		dispatch('Video', url);
	}
</script>

<div class="tab-item">
	<!-- Tab title -->
	<div class="flex items-center gap-2">
		<Icon icon="mdi:link" class="text-xl" />
		<!-- Using Iconify for the Link icon -->
		from URL
	</div>

	<!-- Tab content -->
	<div class="flex flex-col items-center p-4">
		<!-- Input field for YouTube URL -->
		<input
			type="text"
			class="input input-bordered my-2 w-full max-w-xs"
			bind:value={url}
			placeholder="https://www.youtube.com/watch?v=xxxxxxx"
			required
		/>
		<!-- Search button -->
		<button on:click={Search} class="btn btn-primary flex items-center gap-2">
			<Icon icon="mdi:magnify" class="text-xl" />
			<!-- Using Iconify for Search icon -->
			Search
		</button>
	</div>
</div>
