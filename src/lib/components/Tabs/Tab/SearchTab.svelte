<script lang="ts">
	import { Input, Button, ButtonGroup, TabItem, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
	export let url: string;
	let suggestions: string[] = [];
	let isDropdownOpen = false;
	import { createEventDispatcher } from 'svelte';
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

<TabItem>
	<div slot="title" class="flex items-center gap-2"><SearchOutline size="xs" />from Search</div>
	<div class="flex flex-col items-center">
		<ButtonGroup class="w-full">
			<Input
				type="text"
				class="my-2"
				bind:value={url}
				on:input={() => searchSuggestions()}
				placeholder="Relax Music"
				list="suggestions"
				required
			/>
			<Dropdown bind:open={isDropdownOpen}>
				{#if suggestions.length}
					{#each suggestions as entry}
						<DropdownItem
							on:click={(e) => {
								url = e.target.innerText;
								isDropdownOpen = false;
							}}>{entry}</DropdownItem
						>
					{/each}
				{/if}
			</Dropdown>
		</ButtonGroup>
		<Button on:click={Search} class="gap-1"><SearchOutline size="sm" />Search</Button>
	</div>
</TabItem>
