<script lang="ts">
	import { getDateStr } from 'shared/utils';
	import type { PullRequestType } from 'models/skizzle';
	import Labels from 'components/Labels';
	import Modale from 'components/Modale';
	import { isFetchingData } from 'shared/stores/default.store';
	import Avatar from 'components/Avatar';
	import Reviews from 'components/Reviews';
	import Icons from 'components/icons';
	import Comment from 'components/Comment';
	import { remote } from 'shared/remote';

	export let pullRequest: PullRequestType;

	let detailsModal = false;

	const openLink = () => remote.openDefaultBrowser(pullRequest.url);
	const openModale = () => (detailsModal = true);
	const closeModale = () => (detailsModal = false);
</script>

<div class="pr">
	<button class="link" on:click={openLink} />
	<Avatar className="pr__avatar" {pullRequest} />
	<div class="details">
		<header>
			<h2 class="author">
				{pullRequest.user.name} - {getDateStr(new Date(pullRequest.date))}
			</h2>
		</header>
		<h3 class="title">
			{pullRequest.title}
		</h3>
		<p class="repo">
			{#if pullRequest.projectName}
				{pullRequest.projectName}&nbsp;/
			{/if}
			{pullRequest.repositoryName}
		</p>
	</div>
	<footer>
		{#if pullRequest.isAutoComplete}
			<span class="status status--auto-complete">Auto-complete</span>
		{/if}
		{#if pullRequest.isDraft}
			<span class="status status--draft">Draft</span>
		{/if}
		{#if pullRequest.isConflict}
			<span class="status status--conflicts">Conflits</span>
		{/if}
		{#if pullRequest.reviewers}
			<Reviews reviews={pullRequest.reviewers} />
		{/if}
		<Labels labels={pullRequest.labels} />
		<button class="more" on:click={openModale} disabled={$isFetchingData}>
			<Icons.Ellipsis />
		</button>
	</footer>
</div>
{#if detailsModal}
	<Modale onClose={closeModale}>
		{#each pullRequest.comments as comment}
			<Comment {comment} />
		{:else}
			<p class="no-comment">Il n'y a aucun commentaire sur cette pull request.</p>
		{/each}
	</Modale>
{/if}

<style>
	.pr {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		padding: 1rem;
		color: #fff;
		border-radius: 8px;
		background-color: #444;
		transition: opacity linear 0.2s;
	}

	.pr:hover {
		opacity: 0.8;
	}

	:global(.pr__avatar) {
		margin-right: 1rem;
	}

	.details {
		flex: 1 1 calc(100% - 5rem);
	}

	header {
		margin-bottom: 0.5rem;
		font-size: 0.8rem;
		line-height: 1.1;
		color: #aaa;
	}

	.author {
		margin-right: auto;
		font-size: 0.8rem;
		line-height: 1;
	}

	.title {
		margin-bottom: 0.5rem;
		font-size: 1rem;
		line-height: 1.3;
		font-weight: normal;
		display: flex;
		align-items: center;
	}

	.repo {
		font-size: 0.8rem;
		color: #aaa;
		line-height: 1;
	}

	footer {
		display: flex;
		align-items: center;
		width: calc(100% + 2rem);
		margin: 1rem -1rem -1rem;
		padding: 0.5rem 1rem;
		border-radius: 0 0 8px 8px;
		background-color: #3e3e3e;
	}

	.more {
		position: relative;
		z-index: 1;
		display: block;
		width: 1.5rem;
		height: 1.5rem;
		margin-left: auto;
		cursor: pointer;
		border: none;
		background-color: transparent;
	}

	.more:hover {
		background-color: #333;
	}

	.link {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		cursor: pointer;
		border: none;
		background-color: transparent;
	}

	.no-comment {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		text-align: center;
		transform: translateY(-50%);
	}

	.status {
		display: inline-block;
		margin-right: 0.5rem;
		padding: 0 0.2rem;
		font-size: 0.8rem;
		font-weight: normal;
		border-width: 1px;
		border-style: solid;
		border-radius: 4px;
		vertical-align: bottom;
		line-height: 1.5;
	}

	.status--draft {
		border-color: #43fff6;
		color: #43fff6;
	}
	.status--conflicts {
		border-color: #ff5b5b;
		color: #ff5b5b;
	}
	.status--auto-complete {
		border-color: #82ff82;
		color: #82ff82;
	}

	@media only screen and (max-width: 350px) {
		.pr :global(.pr__avatar) {
			display: none;
		}

		.title {
			font-size: 0.8rem;
		}
	}
</style>
