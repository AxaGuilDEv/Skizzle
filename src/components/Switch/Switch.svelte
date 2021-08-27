<script lang="ts">
	import { v4 as uuid } from 'uuid';
	export let active: boolean = false;
	export let label: string = null;
	export let vspace: number = 0;

	let id = uuid();
</script>

<div style={`margin-bottom: ${vspace * 0.5}rem`}>
	<input {id} type="checkbox" bind:checked={active} />
	{#if label}
		<label for={id}>{label}</label>
	{/if}
</div>

<style>
	input {
		display: none;
	}

	label {
		position: relative;
		display: inline-flex;
		align-items: center;
		font-size: 1rem;
		cursor: pointer;
	}

	label:before {
		content: '';
		flex: none;
		display: inline-block;
		width: 3rem;
		height: 1.5rem;
		margin-right: 0.5rem;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 1rem;
		transition: background-color linear 0.2s;
	}

	label:after {
		content: '';
		position: absolute;
		left: 1px;
		top: 50%;
		width: calc(1.5rem - 2px);
		height: calc(1.5rem - 2px);
		border-radius: 50%;
		background-color: #fff;
		transition: transform ease-in-out 0.2s;
		transform: translateY(-50%);
	}

	input:checked + label:before {
		background-color: var(--color);
	}

	input:checked + label:after {
		transform: translateX(calc(100% + 2px)) translateY(-50%);
	}
</style>
