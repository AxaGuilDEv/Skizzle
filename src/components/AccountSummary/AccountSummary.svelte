<script lang="ts">
	import {
		offline,
		profiles,
		pullRequests,
		repositories
	} from 'shared/stores/default.store';
	import Icons from 'components/icons';
	import type { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import { client } from 'shared/stores/authentication.store';
	import type { ProfileType } from 'models/skizzle/ProfileType';

	export let profile: ProfileType;

	const logout = (provider: ProviderEnum) => {
		profiles.update(n => n.filter(x => profile.id !== x.id));
		repositories.reset(provider);
		pullRequests.reset(provider);
		client.update(n => ({
			...n,
			[provider]: {}
		}));
	};
</script>

<div class="container">
	<div class="avatar">
		<img width="64" height="64" src={profile.avatar} alt={profile.name} />
	</div>
	<div class="user">
		<span class="name"
			>{profile?.email ? profile?.name : 'Utilisateur/Utilisatrice anonyme'}</span
		>
		{#if profile?.email}<span class="email">{profile.email}</span>{/if}
	</div>
	<button
		on:click={() => logout(profile.provider)}
		title="Déconnexion"
		disabled={$offline}
	>
		<Icons.Delete />
	</button>
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		padding: 1rem;
		border-radius: 8px;
		background-color: #5c5c5c;
	}

	.avatar {
		width: 3rem;
		height: 3rem;
		margin-right: 0.5rem;
		overflow: hidden;
		border-radius: 50%;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
	}

	span {
		display: block;
	}

	.name {
		font-size: 1rem;
		font-weight: bold;
	}

	.email {
		font-size: 0.8rem;
		color: #ccc;
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

	.user {
		margin-right: auto;
	}
</style>
