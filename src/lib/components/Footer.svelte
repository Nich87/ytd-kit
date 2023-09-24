<script lang="ts">
	import { Footer, FooterCopyright, FooterIcon } from 'flowbite-svelte';
	import { DiscordSolid, TwitterSolid, GithubSolid, UserCircleSolid } from 'flowbite-svelte-icons';
</script>

<div class="flex justify-center w-full flex-grow">
	<Footer class="mt-auto">
		<div class="flex flex-col items-center justify-between">
			<FooterCopyright
				href="https://github.com/Nich87/ytd-kit/blob/main/LICENSE"
				by="Nich87(ysr9029)"
			/>
			<div class="flex mt-4 space-x-6 justify-center py-2 sm:mt-0">
				<FooterIcon href="https://twitter.com/const_root">
					<TwitterSolid
						class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"
					/>
				</FooterIcon>
				<FooterIcon href="https://discord.com/users/484953715225133057">
					<DiscordSolid
						class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"
					/>
				</FooterIcon>
				<FooterIcon href="https://github.com/Nich87">
					<GithubSolid
						class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"
					/>
				</FooterIcon>
				<FooterIcon href="https://voidhacker.com">
					<UserCircleSolid
						class="w-4 h-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"
					/>
				</FooterIcon>
			</div>
		</div>
	</Footer>
</div>
