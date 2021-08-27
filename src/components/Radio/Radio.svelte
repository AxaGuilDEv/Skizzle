<script lang="ts">
	import { v4 as uuid } from 'uuid';
	export let checked: boolean = false;
	export let label: string = null;

	let className: string = '';
	export { className as class };

	let id = uuid();
</script>

<div class={`radio ${className}`}>
	<input on:change {id} type="checkbox" bind:checked />
	{#if label}
		<label for={id}>{label}</label>
	{/if}
</div>
