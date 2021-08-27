<script lang="ts">
	import AccountTitle from 'components/AccountTitle';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import { clientAuthenticated } from 'shared/stores/authentication.store';
	import Icons from 'components/icons';
	import Tabs from 'components/Tabs';
	import { needIntro } from 'shared/stores/default.store';
	import ProviderAccount from 'components/ProviderAccount';

	let step = 0;

	let currentProvider = ProviderEnum.AzureDevOps;

	$: tabs = {
		[ProviderEnum.AzureDevOps]: {
			label: 'Azure DevOps',
			icon: Icons.AzureDevOps,
			order: 0,
			disabled: !$clientAuthenticated.isAzureDevOpsAuthenticated
		},
		[ProviderEnum.Github]: {
			label: 'Github',
			icon: Icons.Github,
			order: 1,
			disabled: !$clientAuthenticated.isGithubAuthenticated
		}
	};

	const next = () => (step += 1);
	const previous = () => (step -= 1);
</script>

<main>
	<div class={`step ${step === 0 ? 'current' : ''}`}>
		<AccountTitle>Bienvenue dans Skizzle. 👋</AccountTitle>
		<p>
			Skizzle vous permet de regrouper toutes les pull requests de vos projets issus de
			Github ou Azure DevOps.
		</p>
		<p>
			Nous allons maintenant configurer ensemble l'application rapidement en quelques étapes.
			Vous êtes prêt ?
		</p>
		<div class="actions">
			<button class="next" on:click={next}>
				C'est parti ! <Icons.ArrowRight />
			</button>
		</div>
	</div>
	<div class={`step ${step === 1 ? 'current' : ''}`}>
		<AccountTitle>Ajouter un compte à Skizzle.</AccountTitle>
		<p>
			Skizzle supporte Github et Azure DevOps, pour pouvoir utiliser l'application vous devez
			ajouter au moins un compte. Choisissez une option et laissez-vous guider.
		</p>
		<ul class="block">
			<li class={$clientAuthenticated.isAzureDevOpsAuthenticated ? 'valid' : ''}>
				<ProviderAccount provider={ProviderEnum.AzureDevOps} light />
			</li>
			<li class={$clientAuthenticated.isGithubAuthenticated ? 'valid' : ''}>
				<ProviderAccount provider={ProviderEnum.Github} light />
			</li>
		</ul>
		<div class="actions">
			<button class="previous" on:click={previous}>
				<Icons.ArrowLeft /> Précédent
			</button>
			<button
				disabled={!$clientAuthenticated.isAzureDevOpsAuthenticated &&
					!$clientAuthenticated.isGithubAuthenticated}
				class="next"
				on:click={next}
			>
				Suivant <Icons.ArrowRight />
			</button>
		</div>
	</div>
	<div class={`step ${step === 2 ? 'current' : ''}`}>
		<AccountTitle>Suivre des repositories</AccountTitle>
		<p>
			Suivez les repositories qui vous intéressent, vous verrez alors leurs pull requests
			dans vos listes.
		</p>
		<div class="block">
			<Tabs
				current={currentProvider}
				onChange={provider => (currentProvider = provider)}
				data={tabs}
			/>
			<div class="repos">
				<ProviderAccount provider={currentProvider} follow />
			</div>
		</div>
		<div class="actions">
			<button class="previous" on:click={previous}>
				<Icons.ArrowLeft /> Précédent
			</button>
			<button class="next" on:click={next}>Suivant <Icons.ArrowRight /></button>
		</div>
	</div>
	<div class={`step ${step === 3 ? 'current' : ''}`}>
		<AccountTitle>Vous êtes prêt à utiliser Skizzle 🎉</AccountTitle>
		<p>
			Vous pouvez maintenant suivre facilement vos projets et créer des listes
			personnalisées.
		</p>
		<div class="actions">
			<button class="previous" on:click={previous}>
				<Icons.ArrowLeft /> Précédent
			</button>
			<button class="next" on:click={() => needIntro.set(false)}>
				Utiliser Skizzle <Icons.ArrowRight />
			</button>
		</div>
	</div>
</main>

<style>
	main {
		position: relative;
		width: 100%;
		background: radial-gradient(circle at 35% 88.98%, var(--color), transparent 61%),
			radial-gradient(circle at 6.01% 9.99%, #0c5064, transparent 35%),
			radial-gradient(circle at 86.01% 70.96%, #262629, transparent 58%),
			radial-gradient(circle at 50% 50%, #333, #333 100%);
	}

	.step {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 100%;
		max-width: 30rem;
		transform: translateX(-50%) translateY(-50%);
		opacity: 0;
		pointer-events: none;
		transition: opacity linear 0.2s;
	}

	.current {
		opacity: 1;
		pointer-events: all;
	}

	p {
		margin-bottom: 1rem;
	}

	.actions {
		margin-top: 2rem;
		padding-top: 1rem;
		display: flex;
		justify-content: space-between;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
	}

	.previous {
		border: none;
		background: none;
	}

	.next {
		display: flex;
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1.2rem;
		cursor: pointer;
		border-radius: 4px;
		border: none;
		background-color: var(--color);
		transition: opacity linear 0.2s;
	}

	.previous,
	.next {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		cursor: pointer;
	}

	.previous :global(svg) {
		margin-right: 0.5rem;
	}

	.next :global(svg) {
		margin-left: 0.5rem;
	}

	.next:not(:disabled):hover {
		opacity: 0.8;
	}

	.next {
		margin-left: auto;
	}

	.block {
		margin-top: 1rem;
		padding: 1rem;
		border-radius: 16px;
		background-color: rgba(0, 0, 0, 0.2);
	}

	.block :global(nav) {
		padding-top: 0;
	}

	.repos {
		height: 50vh;
		overflow: auto;
		padding: 1rem;
		border-radius: 8px;
		background-color: #4e4e4e;
	}

	ul {
		list-style: none;
	}

	li {
		display: flex;
		align-items: center;
		height: 5rem;
	}

	li > :global(*) {
		flex: 1 0 100%;
	}

	li:not(:last-child) {
		margin-bottom: 0.5rem;
	}
</style>
