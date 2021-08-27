<script lang="ts">
	import type { LabelType } from 'models/skizzle/PullRequestType';

	export let labels: LabelType[] = [];
</script>

{#if labels && labels.length > 0}
	<div>
		{#each labels as label}<span>{label.name}</span>{/each}
	</div>
{/if}

<style>
	div {
		flex: 1 1 auto;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	span {
		padding: 0.2rem;
		font-size: 0.8rem;
		font-weight: normal;
		color: #fff;
		line-height: 1.5rem;
		text-align: center;
		line-height: 1;
		vertical-align: middle;
		background-color: #555;
	}

	span:not(:last-child) {
		margin-right: 0.2rem;
	}
</style>
