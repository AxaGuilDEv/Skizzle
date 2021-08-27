<script lang="ts">
	export let min: number;
	export let max: number;
	export let step: number;
	export let value: number;
</script>

<input {min} {max} {step} bind:value type="range" />

<style>
	input[type='range'] {
		-webkit-appearance: none;
		margin: 18px 0;
		width: 100%;
		background-color: transparent;
	}

	input[type='range']::-webkit-slider-runnable-track {
		width: 100%;
		height: 0.5rem;
		cursor: pointer;
		background-color: #ccc;
		border-radius: 8px;
		-webkit-appearance: none;
	}

	input[type='range']::-webkit-slider-thumb {
		height: 1.5rem;
		width: 1.5rem;
		border-radius: 50%;
		background: var(--color);
		cursor: pointer;
		-webkit-appearance: none;
		transform: translateY(calc(-50% + 0.25rem));
	}
</style>
