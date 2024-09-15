<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte'; // If using Iconify
	export let url: string;
	let suggestions: string[] = [];
	let isDropdownOpen = false;
	let dispatch = createEventDispatcher();

	function Search() {
		dispatch('Query', url);
	}

	async function searchSuggestions() {
		const query = url;
		if (!query) return;

		const response = await fetch(`/api/ytdl/search/suggestions?q=${query}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.status !== 200) return;

		suggestions = await response.json();
	}
</script>

<div class="tab-item">
	<!-- Tab title -->
	<div class="flex items-center gap-2">
		<Icon icon="mdi:magnify" class="text-xl" />
		<!-- Using Iconify for Search icon -->
		From Search
	</div>

	<!-- Tab content -->
	<div class="flex flex-col items-center p-4">
		<!-- Input and Dropdown -->
		<div class="relative w-full max-w-md">
			<input
				type="text"
				class="input input-bordered w-full"
				bind:value={url}
				on:input={() => searchSuggestions()}
				on:change={() => searchSuggestions()}
				placeholder="Relax Music"
				required
			/>
			{#if isDropdownOpen && suggestions.length}
				<ul class="absolute left-0 top-full w-full rounded border bg-white shadow-lg">
					{#each suggestions as entry}
						<li
							class="cursor-pointer p-2 hover:bg-gray-100"
							on:click={() => {
								url = entry;
								isDropdownOpen = false;
							}}
						>
							{entry}
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Search button -->
		<button on:click={Search} class="btn btn-primary mt-2 flex items-center gap-2">
			<Icon icon="mdi:magnify" class="text-xl" />
			<!-- Using Iconify for Search icon -->
			Search
		</button>
	</div>
</div>
