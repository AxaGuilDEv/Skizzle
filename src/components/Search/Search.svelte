<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icons from 'components/icons';

	export let disabled: boolean = false;
	export let placeholder: string = '';
	export let vspace: number = 0;

	let className = '';
	export { className as class };

	const dispatch = createEventDispatcher();

	let query: string = '';

	const search = () => {
		dispatch('submit', { query });
	};

	const cancel = () => {
		query = '';
		dispatch('cancel');
	};
</script>

<div class={`search ${className}`} style={`margin-bottom: ${vspace}rem`}>
	<Icons.Search color="#4e4e4e" />
	<form aria-label="valider la recherche de repository" on:submit|preventDefault={search}>
		<input
			aria-label="rechercher les repository par valeur"
			bind:value={query}
			{disabled}
			{placeholder}
		/>
		<input type="submit" />
		{#if query}
			<button on:click|preventDefault={cancel} class="delete">
				<Icons.Delete color="#4e4e4e" />
			</button>
		{/if}
	</form>
</div>

<style>
	form {
		width: 100%;
	}

	[type='submit'] {
		display: none;
	}

	.search {
		position: relative;
	}

	.search > :global(svg) {
		position: absolute;
		left: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.search input {
		width: 100%;
		padding: 1rem 2.5rem;
		color: #fff;
		font-size: 1rem;
		border: none;
		border-radius: 8px;
		background-color: #848484;
	}

	.search input::placeholder {
		color: #4e4e4e;
	}

	.delete {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		width: 1.5rem;
		height: 1.5rem;
		border: none;
		background-color: transparent;
		transform: translateY(-50%);
	}
</style>
