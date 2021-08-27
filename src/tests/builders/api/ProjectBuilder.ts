import { v4 } from 'uuid';
import type {
	AzureDevOpsProjectsApiType,
	AzureDevOpsProjectApiType,
	GithubProjectsApiType,
	GithubProjectApiType
} from 'models/api/ProjectsApiType';

class AzureDevOpsProjectBuilder {
	private project = {} as AzureDevOpsProjectApiType;

	constructor() {
		this.project.id = v4();
	}

	withProjectName(name: string): AzureDevOpsProjectBuilder {
		this.project.name = name;

		return this;
	}

	build(): AzureDevOpsProjectApiType {
		return this.project;
	}
}

class GithubProjectBuilder {
	private project = {} as GithubProjectApiType;

	constructor() {
		this.project.id = v4();
	}

	withProjectName(name: string): GithubProjectBuilder {
		this.project.name = name;

		return this;
	}

	build(): GithubProjectApiType {
		return this.project;
	}
}

class AzureDevOpsProjectsBuilder {
	private projects = {} as AzureDevOpsProjectsApiType;

	withProjects(...projects: AzureDevOpsProjectApiType[]): AzureDevOpsProjectsBuilder {
		this.projects.value = projects;
		this.projects.count = projects.length;

		return this;
	}

	build(): AzureDevOpsProjectsApiType {
		return this.projects;
	}
}

class GithubProjectsBuilder {
	private projects = [] as GithubProjectsApiType;

	withProjects(...projects: GithubProjectApiType[]): GithubProjectsBuilder {
		this.projects = projects;

		return this;
	}

	build(): GithubProjectsApiType {
		return this.projects;
	}
}

export {
	AzureDevOpsProjectsBuilder,
	AzureDevOpsProjectBuilder,
	GithubProjectsBuilder,
	GithubProjectBuilder
};
