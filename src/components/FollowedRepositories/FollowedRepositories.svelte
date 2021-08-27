<script lang="ts">
	import { isFetchingData, repositories } from 'shared/stores/default.store';
	import { deleteRepository } from 'utils';
	import Icons from 'components/icons';
	import AccountTitle from 'components/AccountTitle';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import type { ProfileType, RepositoryType } from 'models/skizzle';
	import Modale from 'components/Modale';
	import { copyToClipboard } from 'shared/utils';
	import ImportExport from 'components/ImportExport';

	export let profile: ProfileType;

	let shareDisplayed: boolean = false;

	$: followedRepositories = $repositories
		.filter(({ provider }) => provider === profile.provider)
		.sort((a, b) => {
			if (a.fullName) {
				return a.fullName > b.fullName ? 1 : -1;
			} else {
				return a.projectName > b.projectName ? 1 : -1;
			}
		}) as RepositoryType[];
</script>

<section>
	<AccountTitle>
		Vos repositories suivis
		<button title="Partager votre liste" on:click={() => (shareDisplayed = true)}
			><Icons.Share /></button
		>
	</AccountTitle>
	<p class="intro">
		Vous suivez actuellement <b>{followedRepositories.length}</b>
		repositories sur {ProviderEnum[profile.provider]}.
	</p>
	<ul>
		{#each followedRepositories as repository}
			<li>
				{#if repository.projectName}
					<span class="project">{repository.projectName}</span>
				{/if}
				{#if repository.fullName}
					<span class="repository">{repository.fullName}</span>
				{:else}<span class="repository">{repository.name}</span>{/if}
				{#if repository.gitUrl}
					<button
						on:click={() =>
							copyToClipboard(
								repository.gitUrl,
								`L'url du repository est copiée dans le presse-papiers.`
							)}
						title="Copier l'url de ce repository"
					>
						<Icons.Copy />
					</button>
				{/if}
				<button
					title="Se désabonner de ce repository"
					on:click={() => deleteRepository(repository)}
					disabled={$isFetchingData}
				>
					<Icons.Delete />
				</button>
			</li>
		{/each}
	</ul>
	{#if shareDisplayed}
		<Modale onClose={() => (shareDisplayed = false)} fullHeight={false}>
			<ImportExport {followedRepositories} bind:shareDisplayed />
		</Modale>
	{/if}
</section>

<style>
	.intro {
		margin-bottom: 1rem;
		font-size: 0.8rem;
		color: #ddd;
	}

	b {
		color: var(--color);
	}

	ul {
		list-style: none;
	}

	li {
		display: flex;
		align-items: center;
		padding: 0.5rem 0.5rem 0.5rem 1rem;
		background-color: #5c5c5c;
	}

	li:not(:last-child) {
		border-bottom: 1px solid #777;
	}

	.project {
		margin-right: 0.2rem;
	}

	.project:after {
		content: '/';
		margin-left: 0.2rem;
		color: #ccc;
	}

	.repository {
		margin-right: auto;
	}

	button {
		width: 1.5rem;
		height: 1.5rem;
		cursor: pointer;
		border: none;
		background-color: transparent;
		transition: opacity linear 0.2s;
	}

	button:hover {
		opacity: 0.5;
	}

	button:last-child {
		margin-left: 0.5rem;
	}

	section :global(nav) {
		margin-right: -2rem;
		margin-left: -2rem;
	}

	:global(.modale) :global(h1) {
		margin-bottom: 1rem;
	}

	:global(.modale) :global(.content) {
		display: flex;
		flex-direction: column;
	}
</style>
