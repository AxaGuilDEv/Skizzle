<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	export let onClose: () => void;
	export let fullHeight: boolean = true;
</script>

<div class="overlay" on:click={onClose} in:fade out:fade />
<div in:fly={{ y: 200 }} out:fly={{ y: 200 }} class="modale" class:fullHeight>
	<button on:click={onClose}>Fermer</button>
	<div class="content">
		<slot />
	</div>
</div>

<style>
	.overlay {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		backdrop-filter: blur(40px);
		background-color: rgba(0, 0, 0, 0.1);
	}

	.modale {
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 2;
		width: calc(100vw - 10rem);
		height: 100%;
		max-height: calc(100vh - 10rem);
		transform: translateX(-50%) translateY(-50%);
		border-radius: 8px;
		background-color: #444;
	}

	.fullHeight {
		height: calc(100vh - 10rem);
	}

	button {
		position: absolute;
		bottom: 100%;
		right: 0;
		padding: 0.5rem;
		font-weight: bold;
		color: #fff;
		cursor: pointer;
		font-size: 1rem;
		border: none;
		background-color: transparent;
		transition: opacity linear 0.2s;
	}
	button:hover {
		opacity: 0.8;
	}
	.content {
		height: 100%;
		padding: 2rem;
		overflow: auto;
	}

	@media only screen and (max-width: 500px) {
		.modale {
			width: calc(100vw - 1rem);
			max-height: calc(100vh - 4rem);
		}

		.fullHeight {
			height: calc(100vh - 1rem);
		}
	}
</style>
