<script lang="ts">
	import Search from 'components/Search';
	import SearchResults from 'components/SearchResults';
	import type { ProfileType } from 'models/skizzle';

	export let profile: ProfileType;

	let search: string = '';

	const onSearchSubmit = async (event: CustomEvent) => {
		search = event.detail.query;
	};

	const onSearchCancel = (): void => {
		search = '';
	};
</script>

<Search
	vspace={1}
	on:submit={onSearchSubmit}
	on:cancel={onSearchCancel}
	placeholder="Rechercher un projet ou un repos"
/>
<SearchResults query={search} {profile} />
