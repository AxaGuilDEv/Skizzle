<script lang="ts">
	import { remote } from 'shared/remote';

	export let error = null;
	export let onError = null;

	const restart = () => {
		if (remote) {
			remote.send('restart');
		}
	};

	let ENV = typeof process !== 'undefined' && process.env && process.env.NODE_ENV;
	let DEV = ENV !== 'production';

	$: if ($error && onError) onError($error);
</script>

{#if $error}
	<main>
		<h1>Félicitations, vous avez trouvé un bug de Skizzle 🎉</h1>
		<p>
			Bien joué, celui-ci est plutôt rare puisque pas encore découvert par l'équipe
			<!-- svelte-ignore a11y-invalid-attribute -->
			de développement de Skizzle. Vous pouvez maintenant
			<a
				href="#"
				on:click={() =>
					remote.openDefaultBrowser('https://github.com/AxaGuilDEv/Skizzle/issues/new')}
			>
				créer une issue sur Github
			</a>
			pour nous le signaler. Merci !
		</p>
		<button on:click={restart}>Redémarrer Skizzle</button>
		<div class="frame">
			<b>{$error.message}</b>
			<pre class="trace">
      {DEV ? $error.stack : ''}
    </pre>
			<span>
				Bug de Skizzle <i>Anonyme - {new Date().getFullYear()}</i>
			</span>
		</div>
	</main>
{:else}
	<slot />
{/if}

<style>
	h1,
	p {
		margin-bottom: 1rem;
	}
	button {
		margin-bottom: 3rem;
	}

	a {
		color: #fff;
	}
	main {
		padding: 2rem;
		text-align: center;
	}
	.frame {
		position: relative;
		color: #333;
		padding: 2rem;
		text-align: left;
		border-left: 1rem solid #ccc;
		border-right: 1rem solid #ccc;
		border-top: 1rem solid #ddd;
		border-bottom: 1rem solid #ddd;
		background-color: #fff;
	}
	b {
		display: block;
		color: red;
		margin-bottom: 0.5rem;
	}
	.trace {
		font-family: monospace;
	}

	button {
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		cursor: pointer;
		border-radius: 4px;
		border: none;
		background-color: var(--color);
		transition: opacity linear 0.2s;
	}

	button:hover {
		opacity: 0.8;
	}

	span {
		position: absolute;
		bottom: -5rem;
		right: 0;
		padding: 0.5rem;
		text-align: left;
		font-size: 0.9rem;
		font-weight: bold;

		background-color: #fff;
	}

	i {
		display: block;
		font-size: 0.7rem;
		font-weight: normal;
	}
</style>
