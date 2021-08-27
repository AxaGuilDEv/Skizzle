<script lang="ts">
	import { fade } from 'svelte/transition';
	import Icons from 'components/icons';
	import { Views } from 'models/skizzle';
	import { settings } from 'shared/stores/default.store';
	export let currentView: Views;
	export let onViewChange: Function;

	$: compact = $settings.compact;

	const setView = (view: Views) => () => onViewChange(view);
	$: getColor = (view: Views) => (currentView === view ? `#fff` : '#d3d3d3');
</script>

<nav transition:fade class:compact>
	<button
		title="Listes"
		on:click={setView(Views.Main)}
		class:selected={currentView === Views.Main}
	>
		<Icons.List color={getColor(Views.Main)} />
		{#if !compact}<span in:fade out:fade>Listes</span>{/if}
	</button>
	<button
		title="Comptes"
		on:click={setView(Views.Accounts)}
		class:selected={currentView === Views.Accounts}
	>
		<Icons.Accounts color={getColor(Views.Accounts)} />
		{#if !compact}<span in:fade out:fade>Comptes</span>{/if}
	</button>
	<button
		class="bottom"
		title="Réglages"
		on:click={setView(Views.Settings)}
		class:selected={currentView === Views.Settings}
	>
		<Icons.Settings color={getColor(Views.Settings)} />
		{#if !compact}<span in:fade out:fade>Réglages</span>{/if}
	</button>
</nav>

<style>
	nav {
		flex-grow: 0;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		width: 8rem;
		height: 100%;
		background-color: #444;
		transition: width linear 0.2s;
	}

	.compact {
		width: 3rem;
	}

	button {
		display: flex;
		justify-content: start;
		align-items: center;
		width: 100%;
		height: 2.5rem;
		padding: 1rem;
		cursor: pointer;
		outline: none;
		font-weight: bold;
		color: #fff;
		border: 0;
		background-color: transparent;
		transition: background-color linear 0.1s;
	}

	button :global(svg) {
		flex: 0 0 1rem;
		margin-right: 0.5rem;
	}

	button:hover:not(.selected) {
		background-color: rgba(255, 255, 255, 0.2);
	}

	button:focus:not(.selected) {
		background-color: var(--color-focus);
	}

	.selected {
		background-color: var(--color);
	}

	.bottom {
		margin-top: auto;
	}

	@media only screen and (max-width: 300px) {
		nav,
		nav.compact {
			flex-direction: row;
			width: 100vw;
			height: 2.5rem;
			border-top: 1px solid #333;
		}

		.bottom {
			margin-top: 0;
		}

		button {
			justify-content: center;
		}

		span {
			display: none;
		}

		button :global(svg) {
			margin-right: 0;
		}
	}
</style>
