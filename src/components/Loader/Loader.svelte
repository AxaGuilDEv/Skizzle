<script lang="ts">
	import { fade } from 'svelte/transition';
	import { isFetchingData, isLoading, settings } from 'shared/stores/default.store';
	$: compact = $settings.compact;
</script>

{#if $isLoading || $isFetchingData}
	<div in:fade out:fade={{ delay: 200 }} class:compact />
{/if}

<style>
	div {
		animation: fadeIn 0.2s;
		position: fixed;
		top: 0.2rem;
		left: 8.2rem;
		right: 0.2rem;
		overflow: hidden;
		height: 0.2rem;
		background-color: #4e4e4e;
		border-radius: 8px;
		transition: left linear 0.2s;
	}

	.compact {
		left: 3.2rem;
	}

	div:before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 50%;
		height: 100%;
		border-radius: 8px;
		background-color: var(--color);
		animation: loader 1.2s infinite ease-in-out;
	}

	@media only screen and (max-width: 300px) {
		div,
		.compact {
			left: 0.2rem;
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes loader {
		0% {
			opacity: 0;
			transform: translateX(-100%) scaleX(1);
		}

		50% {
			opacity: 1;
		}

		100% {
			opacity: 0;
			transform: translateX(100vw) scaleX(0.8);
		}
	}
</style>
