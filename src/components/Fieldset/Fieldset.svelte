<script lang="ts">
	export let title: string = undefined;
	export let intro: string = undefined;
	export let outro: string = undefined;
</script>

<fieldset>
	<legend>{title}</legend>
	{#if intro}
		<p>{intro}</p>
	{/if}
	<slot />
	{#if outro}
		<p>{outro}</p>
	{/if}
</fieldset>

<style>
	legend {
		font-family: 'roboto slab', serif;
	}

	fieldset {
		padding: 1rem;
		border: none;
		border-radius: 8px;
		background-color: #444;
	}

	fieldset:not(:last-child) {
		margin-bottom: 2rem;
	}

	p {
		font-size: 0.8rem;
	}

	p:not(:last-child) {
		margin-bottom: 1rem;
	}
</style>
