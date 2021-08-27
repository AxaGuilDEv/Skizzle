import type { ProviderEnum } from './ProviderEnum';

export type CommonType = {
	pullRequestId?: string;
	repositoryId?: string;
	projectId?: string;
	organizationName?: string;
	repositoryName?: string;
	projectName?: string;
	provider?: ProviderEnum;
};
