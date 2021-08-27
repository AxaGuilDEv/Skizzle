<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icons from '../icons';

	export let id: string;
	export let label: string;
	export let suggestions: string[] = [];
	export let tags: string[] = [];
	export let value: string = '';
	export let disabled: boolean = false;
	export let show: boolean = true;

	const dispatch = createEventDispatcher();
	let showSuggestion: boolean = false;
	let mouseOverSuggestion: boolean = false;

	const inputTag = (
		event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }
	) => {
		const value = event.currentTarget.value;

		if (event.code === 'Enter' && value) {
			const result = value.substring(0, value.length);

			chipTags = [...chipTags, result];
			event.currentTarget.value = '';

			dispatch('tags', { tags: chipTags });
		}
	};

	const addTag = (tag: string) => {
		if (!chipTags.some(x => x === tag)) {
			chipTags = [...chipTags, tag];
			value = '';
			showSuggestion = false;
			mouseOverSuggestion = false;
			dispatch('tags', { tags: chipTags });
		}
	};

	const deleteChip = (index: number) => {
		chipTags.splice(index, 1);
		chipTags = chipTags;
		dispatch('tags', { tags: chipTags });
	};

	$: chipTags = [...tags] as string[];
	$: suggestionsFiltered = suggestions
		.filter(x => !chipTags.includes(x))
		.filter(x => x.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())) as string[];
</script>

{#if show}
	<div class="field {disabled ? 'field--disabled' : ''}">
		<div class="field-input">
			<span>{label}</span>
			{#if chipTags.length}
				<div class="chips">
					{#each chipTags as tag, index}
						<div class="chip">
							<span>{tag}</span>
							<button on:click={() => deleteChip(index)}>
								<Icons.Delete color="#fff" />
							</button>
						</div>
					{/each}
				</div>
			{/if}
			<div class="data">
				<input
					{id}
					{disabled}
					type="text"
					bind:value
					on:keyup={event => inputTag(event)}
					on:focusin={() => (showSuggestion = true)}
					on:focusout={() => (showSuggestion = false)}
				/>
				{#if (showSuggestion || mouseOverSuggestion) && suggestionsFiltered.length}
					<div
						class="suggestions"
						on:mouseover={() => (mouseOverSuggestion = true)}
						on:mouseleave={() => (mouseOverSuggestion = false)}
					>
						<ul>
							{#each suggestionsFiltered as suggestion}
								<li on:click={() => addTag(suggestion)}>
									<small>{suggestion}</small>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>
		{#if $$slots.options}
			<div class="options">
				<slot name="options" />
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	.field {
		display: flex;
	}

	.field--disabled {
		background-color: #eee;
		border-bottom: 0;
	}

	.field-input {
		width: 100%;
	}

	.field-input > span {
		display: block;
		flex: 0 1 auto;
		margin-bottom: 0.2rem;
		color: #fff;
	}

	.data {
		position: relative;
		flex: 1 0 auto;
		width: 100%;
	}

	.chip {
		display: flex;
		align-items: center;
		font-size: 0.75rem;
		background-color: var(--color);
		padding: 0.5rem;
		border-radius: 4px;
		margin-bottom: 0.25rem;
		margin-right: 0.25rem;

		button {
			margin-left: 0.5rem;
			background-color: transparent;
		}
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
	}

	.chip > span {
		color: #fff;
	}

	.chip :global(svg) {
		width: 10px !important;
		height: 10px !important;
	}

	.suggestions {
		position: absolute;
		z-index: 1;
		background-color: #888;
		padding: 1rem;
		box-shadow: 0 2px 4px 0 rgb(0 0 0 / 11%);
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.options {
		display: flex;
		align-items: flex-start;
		padding-top: 1rem;
	}

	input:disabled {
		cursor: not-allowed;
	}

	[type='text'] {
		padding: 0.5rem;
		font-size: 1rem;
		border: none;
		background-color: #555;
		width: 100%;
		border-radius: 4px;
		color: #fff;
	}

	ul {
		list-style: none;
		padding: 0;
		margin-bottom: 0;
		overflow-y: auto;
	}

	ul li {
		display: flex;
		flex-direction: column;
		padding: 0.25rem;
		cursor: pointer;
	}

	ul li:hover {
		background-color: #666;
	}
</style>
