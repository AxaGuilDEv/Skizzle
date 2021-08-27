import { render, screen } from '@testing-library/svelte';
import App from 'App.svelte';
import { config as urls } from 'config';
import { ProviderEnum } from 'models/skizzle';
import { clickButton } from 'tests/actions/clickButton';
import { connectWith } from 'tests/actions/connection';
import { formAsync } from 'tests/actions/form';
import { inputAsync } from 'tests/actions/input';
import { AzureDevOpsDescriptorBuilder } from 'tests/builders/api/DescriptorBuilder';
import {
	AzureDevOpsOrganizationBuilder,
	AzureDevOpsOrganizationsBuilder
} from 'tests/builders/api/OrganizationBuilder';
import { AzureDevOpsProfileBuilder } from 'tests/builders/api/ProfileBuilder';
import {
	AzureDevOpsProjectBuilder,
	AzureDevOpsProjectsBuilder
} from 'tests/builders/api/ProjectBuilder';
import {
	AzureDevOpsRepositoriesBuilder,
	AzureDevOpsRepositoryBuilder
} from 'tests/builders/api/RepositoryBuilder';
import { OAuthConfigBuilder } from 'tests/builders/providers/OAuthConfigBuilder';
import { RequesterBuilder } from 'tests/builders/requesters/RequesterBuilder';

test('The application is opened and the user search for a repository', async () => {
	const config = new OAuthConfigBuilder().withToken('Bearer token').build();
	const profile = new AzureDevOpsProfileBuilder()
		.withEmailAddress('john.doe@email.com')
		.withDisplayName('John Doe')
		.build();
	const descriptor = new AzureDevOpsDescriptorBuilder().withDescriptor().build();
	const organization = new AzureDevOpsOrganizationBuilder()
		.withOrganizationName('AzureOrg1')
		.build();
	const organizations = new AzureDevOpsOrganizationsBuilder()
		.withOrganizations(organization)
		.build();
	const project = new AzureDevOpsProjectBuilder().withProjectName('Project1').build();
	const projects = new AzureDevOpsProjectsBuilder().withProjects(project).build();
	const repository = new AzureDevOpsRepositoryBuilder().withName('Repository1').build();
	const repositories = new AzureDevOpsRepositoriesBuilder()
		.withRepositories(repository)
		.build();

	new RequesterBuilder()
		.get(urls.AzureDevOps.get.profile('me'), profile)
		.get(urls.AzureDevOps.get.descriptor(profile.id), descriptor)
		.get(urls.AzureDevOps.get.organizations(profile.id), organizations)
		.get(urls.AzureDevOps.get.projects(organization.accountName), projects)
		.get(
			urls.AzureDevOps.get.repositories(organization.accountName, project.id),
			repositories
		)
		.build();

	render(App, {});

	clickButton('Comptes');
	connectWith(ProviderEnum.AzureDevOps, config);

	await screen.findByText('Votre compte AzureDevOps');
	await inputAsync('rechercher les repository par valeur', { value: repository.name });
	await formAsync('valider la recherche de repository');
	await screen.findByText('Project1 / Repository1');
});
