<script lang="ts">
	import AccountTitle from 'components/AccountTitle';
	import Fieldset from 'components/Fieldset';
	import Range from 'components/Range';
	import { ThemeEnum } from 'models/skizzle';
	import { settings } from 'shared/stores/default.store';
	import Icons from 'components/icons';
	import Switch from 'components/Switch';

	let currentPlatform: string = navigator.platform === 'Win32' ? 'Windows' : 'macOS';
</script>

<div class="content">
	<form>
		<AccountTitle>Réglages</AccountTitle>

		<Fieldset
			title="Rafraichissement"
			intro="Réglez ici le délai qu'utilisera Skizzle pour rafraichir les données."
			outro={`Skizzle rafraichira les données toutes les ${
				$settings.refresh_delay !== 1 ? `${$settings.refresh_delay} minutes` : '60 secondes'
			}`}
		>
			<div class="field">
				<Range bind:value={$settings.refresh_delay} min={5} step={5} max={30} />
			</div>
		</Fieldset>

		<Fieldset
			title="Au démarrage"
			outro={`${
				$settings.launch_at_startup
					? 'Skizzle se lancera automatiquement à chaque démarrage de '
					: 'Skizzle ne se lancera pas au démarrage de '
			} ${currentPlatform}.`}
		>
			<Switch
				vspace={2}
				bind:active={$settings.launch_at_startup}
				label="Lancer Skizzle au démarrage"
			/>
			<p class="text" />
		</Fieldset>

		<Fieldset
			title="Menu compact"
			intro="Ce paramètre permet de réduire la largeur de la barre latérale de navigation."
		>
			<Switch bind:active={$settings.compact} label="Mode compact" />
		</Fieldset>

		<Fieldset title="Langue" intro="Choisissez ici la langue de l'interface de Skizzle.">
			<select>
				<option value={$settings.language}>{$settings.language}</option>
			</select>
		</Fieldset>

		<Fieldset title="Proxy" intro="URL du serveur de proxy">
			<input id="proxy" type="url" bind:value={$settings.proxy} />
		</Fieldset>

		<Fieldset title="Theme" intro="Choisissez un theme pour l'interface de Skizzle.">
			<div class="field">
				{#each Object.values(ThemeEnum) as value}
					<input
						name="color"
						id={value}
						type="radio"
						checked={$settings.theme === value}
						on:change={() =>
							settings.update(settings => ({
								...settings,
								theme: value
							}))}
					/>
					<label class="ui" for={value}>
						<Icons.UI color={value} />
					</label>
				{/each}
			</div>
		</Fieldset>
	</form>
</div>

<style>
	.content {
		flex: 1 0 auto;
		padding: 1rem;
	}

	.field {
		display: flex;
	}

	.field :global(svg) {
		display: block;
		width: 15rem;
		height: auto;
		border: 4px solid #fff;
	}

	[type='radio'] {
		display: none;
	}

	.field :global([type='range']) {
		max-width: 15rem;
	}

	.ui {
		opacity: 0.5;
		margin-right: 1rem;
		cursor: pointer;
		transition: opacity linear 0.2s, box-shadow linear 0.2s;
	}

	.ui:hover {
		opacity: 1;
	}

	input:checked + .ui {
		opacity: 1;
		box-shadow: 0 0 0 4px var(--color);
	}

	form :global(h1) {
		margin-bottom: 2rem;
	}

	.field {
		margin-bottom: 1rem;
	}
</style>
