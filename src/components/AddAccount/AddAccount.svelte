<script lang="ts">
	import Icons from 'components/icons';
	import { isFetchingData, offline } from 'shared/stores/default.store';
	import type { ProviderEnum } from 'models/skizzle';
	import { remote } from 'shared/remote';
	import { client } from 'shared/stores/authentication.store';

	export let provider: ProviderEnum;
	export let text: string;

	const authorize = (provider: ProviderEnum, isSilent = false) => {
		remote.send('oauth', provider, isSilent);
		remote.receive('getToken', args =>
			client.update(n => ({
				...n,
				[provider]: {
					...n[provider],
					...args
				}
			}))
		);
	};
</script>

<div>
	<button
		role="button"
		title={text}
		on:click={() => authorize(provider)}
		disabled={$isFetchingData || $offline}><Icons.AddAccount />{text}</button
	>
</div>

<style>
	div {
		padding: 1rem;
		text-align: center;
		border-radius: 8px;
		background-color: #5c5c5c;
	}

	button {
		position: relative;
		padding: 1rem 1rem 1rem 2.5rem;
		color: #fff;
		font-size: 1rem;
		border: none;
		background-color: transparent;
	}

	div :global(.icon) {
		position: absolute;
		left: 0.5rem;
		top: 50%;
		width: 1.5rem;
		transform: translateY(-50%);
	}
</style>
