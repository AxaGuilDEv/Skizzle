<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import {
		getDateStr,
		getLabelsFrom,
		getPullRequestsFromCustomSettings
	} from 'shared/utils';
	import AccountTitle from 'components/AccountTitle';
	import type { CustomListType, PullRequestType } from 'models/skizzle';
	import {
		customLists,
		notifications,
		pullRequests,
		repositories,
		settings
	} from 'shared/stores/default.store';
	import Icons from 'components/icons';
	import TagInput from 'components/TagInput';
	import { client } from 'shared/stores/authentication.store';
	import Radio from 'components/Radio';
	import Switch from 'components/Switch';

	export let onDone: () => void;
	export let isInCreationMode: boolean = false;
	export let customList: CustomListType = {
		id: uuidv4(),
		name: '',
		tags: []
	} as CustomListType;

	let isListDisplayed = false;

	const onImport = async () => {
		const result: any = await window.remote.invoke('file-import');

		if (result) {
			customList = { ...JSON.parse(result), id: uuidv4() } as CustomListType;

			notifications.update(notifications => [
				...notifications,
				{
					text: 'Liste importée.',
					id: uuidv4()
				}
			]);
		}
	};

	const saveSettings = () => {
		updateSettings({
			...customList,
			hiddenPullRequestsIds: pullRequestsList.reduce((acc, curr) => {
				if (!curr.show) {
					acc.push(curr.pullRequest.pullRequestId);
				}

				return acc;
			}, [] as string[])
		});

		notifications.update(notifications => [
			...notifications,
			{
				text: `Liste ${isInCreationMode ? 'créée' : 'modifiée'}`,
				id: uuidv4()
			}
		]);

		onDone();
	};

	const updateSettings = (list: CustomListType) => {
		customLists.update(x => {
			const exist = ({ id }: CustomListType) => list.id === id;

			if (!x.some(exist)) {
				x = [...x, list];
			} else {
				x[x.indexOf(x.find(exist))] = list;
			}

			return x;
		});
	};

	const getTags = (event: CustomEvent<{ tags: string[] }>) => {
		customList.tags = event.detail.tags;
	};

	$: pullRequestsList = getPullRequestsFromCustomSettings($pullRequests, customList)
		.filter(pr => !!pr)
		.map(x => ({
			pullRequest: x,
			show:
				!customList.hiddenPullRequestsIds ||
				!customList.hiddenPullRequestsIds.some(y => y === x.pullRequestId)
		})) as { pullRequest: PullRequestType; show: boolean }[];
</script>

<div>
	<AccountTitle>
		{customList.name ? 'Modification de la liste' : "Création d'une liste"}
		<button class="import" on:click={onImport}>Importer</button>
	</AccountTitle>
	<div class="fields">
		<div class="field">
			<label for="list-name">Nom de la liste :</label>
			<input id="list-name" type="text" bind:value={customList.name} />
		</div>
		<div class="field">
			<TagInput
				id="tags"
				label="Afficher les pull request contenant les tags :"
				suggestions={getLabelsFrom($pullRequests)}
				tags={customList.tags}
				on:tags={event => getTags(event)}
			/>
		</div>
		<div class="field">
			<label for="list-provider">Afficher les pull requests de mon compte :</label>
			<select id="list-provider" bind:value={customList.provider}>
				<option value="">-- Selectionner un service --</option>
				{#each Object.keys($client) as key}
					<option value={key}>
						{key}
					</option>
				{/each}
			</select>
		</div>
		<div class="field">
			<label for="repo">Afficher les pull requests de ce repository :</label>
			<select id="repo" bind:value={customList.repositoryId}>
				<option value="">-- Selectionner un repository --</option>
				{#each $repositories as repository}
					<option value={repository.repositoryId}>
						{repository.name}
					</option>
				{/each}
			</select>
		</div>
		<div class="field">
			<p>Masquer les pull requests</p>
			<ul>
				<li>
					<Radio bind:checked={customList.withoutOwnedByUserPR} label="Que j'ai créé" />
				</li>
				<li>
					<Radio bind:checked={customList.withoutOldPR} label="Datant de plus de 30 jours" />
				</li>
				<li>
					<Radio bind:checked={customList.withoutConflict} label="En conflit" />
				</li>
				<li>
					<Radio bind:checked={customList.withoutDraft} label="En brouillon" />
				</li>
				<li>
					<Radio
						bind:checked={customList.withoutCheckedByOwner}
						label="Que j'ai déjà approuvé"
					/>
				</li>
			</ul>
		</div>
		{#if pullRequestsList.length > 0}
			<div class="field">
				<Switch
					vspace={1}
					bind:active={isListDisplayed}
					label="Masquer manuellement certaines pull requests"
				/>
				{#if isListDisplayed}
					<ul>
						{#each pullRequestsList.filter(pr => pr != null) as { pullRequest, show } (pullRequest.pullRequestId)}
							<li>
								<Radio
									on:change={() => (show = !show)}
									checked={!show}
									label={pullRequest.title}
								/>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</div>
</div>
<div class="action">
	<button class="cancel" on:click={() => onDone()}>Annuler</button>
	<button class="cta" on:click={() => saveSettings()}>Enregistrer</button>
</div>

<style>
	.import {
		padding: 0.5rem;
		color: var(--color);
		font-size: 1rem;
		border: none;
		background-color: transparent;
	}

	.field {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.2rem;
	}

	[type='text'] {
		width: 100%;
		padding: 0.5rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		background-color: #555;
	}

	select {
		width: 100%;
		padding: 0.5rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		background-color: #555;
	}

	ul {
		list-style: none;
		border-radius: 4px;
		background-color: #555;
	}

	li {
		padding: 0.5rem;
	}

	li:not(:last-child) {
		border-bottom: 1px solid #666;
	}

	.action {
		display: flex;
		justify-content: flex-end;
	}

	.cta {
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		cursor: pointer;
		border-radius: 4px;
		border: none;
		background-color: var(--color);
		transition: opacity linear 0.2s;
	}

	.cancel {
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		cursor: pointer;
		border: none;
		background-color: transparent;
		transition: opacity linear 0.2s;
	}

	:global(.isListDisplayed) {
		margin-bottom: 0.2rem;
	}
</style>
