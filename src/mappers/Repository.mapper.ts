import type { AzureDevOpsRepositoryApiType, GithubRepositoryApiType } from 'models/api';
import type { RepositoryType } from 'models/skizzle';
import { From, Mapper } from './Mapper';

export type RepositoryMapperType = From<
	AzureDevOpsRepositoryApiType,
	GithubRepositoryApiType
>;

export class RepositoryMapper extends Mapper<RepositoryMapperType, RepositoryType> {
	public to(data: RepositoryMapperType[], params: any): RepositoryType[] {
		return data.map(value => {
			return {
				repositoryId: value.id,
				name: value.name,
				fullName: value.full_name,
				owner: value.owner?.login,
				gitUrl:
					value.clone_url ||
					`https://dev.azure.com/${params.organizationName}/${params.projectName}/_git/${value.name}.git`,
				...params
			};
		});
	}
}
