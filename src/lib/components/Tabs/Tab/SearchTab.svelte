<script lang="ts">
	import { Input, Button, ButtonGroup, TabItem, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
	export let url: string;
	let suggestions: string[] = [];
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

		if (response.status !== 200) {
			return console.error(response.status, response);
		}

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
			<Dropdown>
				{#if suggestions.length}
					{#each suggestions as entry}
						<DropdownItem
							on:click={(e) => {
								url = e.originalTarget.innerText;
							}}>{entry}</DropdownItem
						>
					{/each}
				{/if}
			</Dropdown>
		</ButtonGroup>
		<Button on:click={Search} class="gap-1"><SearchOutline size="sm" />Search</Button>
	</div>
</TabItem>
