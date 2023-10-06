<script lang="ts">
	import { DarkMode } from 'flowbite-svelte';
	import { SunSolid, MoonSolid } from 'flowbite-svelte-icons';
</script>

<header class="flex justify-end p-4">
	<DarkMode>
		<svelte:fragment slot="lightIcon">
			<SunSolid />
		</svelte:fragment>
		<svelte:fragment slot="darkIcon">
			<MoonSolid />
		</svelte:fragment>
	</DarkMode>
</header>
