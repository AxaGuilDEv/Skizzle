import type { RepositoryType } from 'models/skizzle';
import { Service } from 'services/Service';
import { pullRequests, repositories } from 'shared/stores/default.store';

export const checkRepository = async ({ target }, repository: RepositoryType) => {
	const { checked } = target as HTMLInputElement;

	if (checked) {
		repositories.update(x => [...x, repository]);

		const values = await Service.getPullRequests(repository.provider, {
			repository
		});

		pullRequests.update(x =>
			[...x, ...values].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
		);
	} else {
		deleteRepository(repository);
	}
};

export const deleteRepository = async (repository: RepositoryType) => {
	repositories.update(x => x.filter(y => y.repositoryId !== repository.repositoryId));

	pullRequests.update(x => x.filter(y => y.repositoryId !== repository.repositoryId));
};
