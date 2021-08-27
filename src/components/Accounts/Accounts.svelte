<script lang="ts">
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import Tabs from 'components/Tabs';
	import Icons from 'components/icons';
	import ProviderAccount from 'components/ProviderAccount';

	let provider = ProviderEnum.AzureDevOps;

	const tabs = {
		[ProviderEnum.AzureDevOps]: {
			label: 'Azure DevOps',
			icon: Icons.AzureDevOps,
			order: 0
		},
		[ProviderEnum.Github]: {
			label: 'Github',
			icon: Icons.Github,
			order: 1
		}
	};
</script>

<Tabs
	current={provider}
	onChange={currentProvider => (provider = currentProvider)}
	data={tabs}
/>
<div class="content">
	<ProviderAccount {provider} />
</div>

<style>
	.content {
		position: relative;
		display: flex;
		flex-direction: column;
		height: calc(100vh - 6rem);
		flex: 1 0 auto;
		padding: 1rem;
		overflow: auto;
		background-color: #4e4e4e;
	}

	.content :global(.loader),
	.content :global(.error) {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
	}
</style>
