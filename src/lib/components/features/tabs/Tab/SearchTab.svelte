<script lang="ts">
	import Icon from '@iconify/svelte';

	let { url = $bindable(), onQuery } = $props();
	let suggestions = $state<string[]>([]);
	let isDropdownOpen = $state(false);

	function Search() {
		onQuery?.(url);
	}

	async function searchSuggestions() {
		const query = url;
		if (!query) {
			suggestions = [];
			isDropdownOpen = false;
			return;
		}

		const response = await fetch(`/api/ytdl/search/suggestions?q=${query}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.status !== 200) {
			suggestions = [];
			isDropdownOpen = false;
			return;
		}

		suggestions = await response.json();
		isDropdownOpen = suggestions.length > 0;
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
				oninput={() => searchSuggestions()}
				onfocus={() => {
					if (suggestions.length > 0) {
						isDropdownOpen = true;
					}
				}}
				onblur={() => {
					// 少し遅延させてクリックイベントを処理できるようにする
					setTimeout(() => {
						isDropdownOpen = false;
					}, 200);
				}}
				placeholder="Relax Music"
				required
			/>
			{#if isDropdownOpen && suggestions.length}
				<ul
					class="absolute left-0 top-full w-full rounded border border-base-300 bg-base-100 shadow-xl z-50 max-h-60 overflow-y-auto"
				>
					{#each suggestions as entry}
						<li>
							<button
								type="button"
								class="w-full text-left cursor-pointer p-3 hover:bg-base-200 block text-base-content border-b border-base-200 last:border-b-0 transition-colors"
								onclick={() => {
									url = entry;
									isDropdownOpen = false;
								}}
							>
								{entry}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Search button -->
		<button onclick={Search} class="btn btn-primary mt-2 flex items-center gap-2">
			<Icon icon="mdi:magnify" class="text-xl" />
			<!-- Using Iconify for Search icon -->
			Search
		</button>
	</div>
</div>
