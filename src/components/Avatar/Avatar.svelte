<script lang="ts">
	import type { PullRequestType } from 'models/skizzle/PullRequestType';
	import Icons from 'components/icons';
	import { Service } from 'services/Service';
	import { settings } from 'shared/stores/default.store';

	export let pullRequest: PullRequestType;
	export let className: string;
</script>

<div class={`container ${className || ''}`}>
	{#await Service.getAvatar(pullRequest.provider, pullRequest.user.avatar, pullRequest.organizationName)}
		<div class="avatar">
			<svelte:component this={Icons.User} color={$settings.theme} />
		</div>
	{:then avatar}
		<div class="avatar"><img src={avatar} alt={pullRequest.user.name} /></div>
		{#if pullRequest.provider}
			<div class="badge">
				<svelte:component this={Icons[pullRequest.provider]} />
			</div>
		{/if}
	{:catch}
		<div class="avatar">
			<svelte:component this={Icons.User} color={$settings.theme} />
		</div>
	{/await}
</div>

<style>
	.container {
		position: relative;
		height: 4rem;
	}

	.avatar {
		width: 4rem;
		height: 4rem;
		overflow: hidden;
		border-radius: 50%;
		border: 2px solid #fff;
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.badge {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		border: 2px solid #fff;
		background-color: #333;
	}

	.badge :global(svg) {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 60%;
		height: auto;
		transform: translateY(-50%) translateX(-50%);
	}
</style>
