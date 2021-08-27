<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { pullRequests, customLists, notifications } from 'shared/stores/default.store';
	import PullRequest from 'components/PullRequest';
	import Tabs from 'components/Tabs';
	import CustomListSettings from 'components/CustomListSettings';
	import Modale from 'components/Modale';
	import type { CustomListType } from 'models/skizzle';
	import { getPullRequestsFromCustomSettings } from 'shared/utils';
	import { remote } from 'shared/remote';

	let creatingList: boolean = false;
	let modifyingListId: string = null;
	let currentTab: string = 'all';

	const closeModale = () => {
		creatingList = false;
		modifyingListId = null;
	};

	const exportList = async () => {
		const currentTabData = $customLists.find(customList => customList.id == currentTab);

		if (currentTabData) {
			const result: boolean = await remote.invoke('file-export', currentTabData);

			if (result) {
				notifications.update(notifications => [
					...notifications,
					{
						text: 'Liste exportée.',
						id: uuidv4()
					}
				]);
			}
		}
	};

	const deleteList = () => {
		customLists.update(list => list.filter(_list => _list.id !== currentTab));
		notifications.update(notifications => [
			...notifications,
			{
				text: 'Liste supprimée.',
				id: uuidv4()
			}
		]);
		currentTab = 'all';
	};

	const filterList = (customList: CustomListType) => {
		return getPullRequestsFromCustomSettings($pullRequests, customList).filter(
			x => !customList.hiddenPullRequestsIds?.some(y => x.pullRequestId === y)
		);
	};

	const getTabs = (lists: CustomListType[]) => {
		const tabs = {
			all: {
				label: 'Toutes',
				order: 0
			}
		};

		lists.forEach((list, index) => {
			tabs[list.id] = {
				label: list.name,
				order: index + 1,
				counter: filterList(list).length
			};
		});

		return tabs;
	};

	$: tabs = getTabs($customLists);
	$: displayedList =
		currentTab === 'all'
			? $pullRequests
			: filterList($customLists.find(({ id }) => id === currentTab));
</script>

<Tabs
	current={currentTab}
	onChange={tab => (currentTab = tab)}
	data={tabs}
	onCreation={() => {
		creatingList = true;
	}}
/>

{#if creatingList || modifyingListId}
	<Modale onClose={closeModale}>
		<CustomListSettings
			customList={$customLists.find(({ id }) => id === modifyingListId)}
			isInCreationMode={creatingList}
			onDone={closeModale}
		/>
	</Modale>
{/if}

<div class="content">
	{#if currentTab !== 'all'}
		<div class="bar">
			<button
				on:click={() => {
					modifyingListId = currentTab;
				}}
			>
				Modifier
			</button>
			<button on:click={deleteList}>Supprimer</button>
			<button on:click={exportList}>Exporter</button>
		</div>
	{/if}
	{#if displayedList.length}
		<ul class="list">
			{#each displayedList as pullRequest}
				{#if pullRequest}
					<li>
						<PullRequest {pullRequest} />
					</li>
				{/if}
			{/each}
		</ul>
	{:else}
		<p class="no-pr">Il n'y a aucune pull request à afficher dans cette liste.</p>
	{/if}
</div>

<style>
	.content {
		position: relative;
		height: calc(100vh - 6rem);
		flex: 1 0 auto;
		padding: 1rem;
		overflow: auto;
		background-color: #4e4e4e;
	}

	.list {
		list-style: none;
	}

	.list li:not(:last-child) {
		margin-bottom: 1rem;
	}

	.bar {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1rem;
	}

	.bar button {
		padding: 0.5rem;
		color: var(--color);
		border: none;
		background-color: transparent;
	}

	.bar button:not(:first-child) {
		margin-left: 0.5rem;
	}

	.no-pr {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
	}

	@media only screen and (max-width: 300px) {
		.content {
			padding: 0.2rem;
		}

		.bar {
			margin-bottom: 0;
			justify-content: center;
		}

		.list li:not(:last-child) {
			margin-bottom: 0.2rem;
			/* border-bottom: 1px solid #eee; */
		}
	}
</style>
