import { render, screen } from '@testing-library/svelte';
import App from 'App.svelte';
import { config as urls } from 'config';
import { clickButton } from 'tests/actions/clickButton';
import { connectWith } from 'tests/actions/connection';
import { formAsync } from 'tests/actions/form';
import { inputAsync } from 'tests/actions/input';
import { select } from 'tests/actions/select';
import {
	GithubRepositoriesBuilder,
	GithubRepositoryBuilder
} from 'tests/builders/api/RepositoryBuilder';
import { ProviderEnum } from '../../../../models/skizzle';
import { GithubProfileBuilder } from '../../../builders/api/ProfileBuilder';
import { OAuthConfigBuilder } from '../../../builders/providers/OAuthConfigBuilder';
import { RequesterBuilder } from '../../../builders/requesters/RequesterBuilder';

test('The application is opened and the user search for a repository', async () => {
	const config = new OAuthConfigBuilder().withToken('Bearer token').build();
	const profile = new GithubProfileBuilder()
		.withEmail('john.doe@email.com')
		.withName('John Doe')
		.build();
	const repository = new GithubRepositoryBuilder()
		.withCloneUrl('http://repository1.git')
		.withFullName('Project1 / Repository1')
		.withOwner('John Doe')
		.withName('Repository1')
		.build();
	const repository2 = new GithubRepositoryBuilder()
		.withCloneUrl('http://repository2.git')
		.withFullName('Project1 / Repository2')
		.withOwner('Jean ive')
		.withName('Repository2')
		.build();
	const repositories = new GithubRepositoriesBuilder()
		.withRepositories(repository)
		.build();
	const searchRepositories = new GithubRepositoriesBuilder()
		.withRepositories(repository2)
		.buildSearch();

	const query = 'Repos';

	new RequesterBuilder()
		.get(urls.Github.get.profile(), profile)
		.get(urls.Github.get.privateRepositories(), repositories)
		.get(urls.Github.get.repositories(query), searchRepositories)
		.build();

	const { container } = render(App, {});

	clickButton('Comptes');
	select('Sélectionner', 'Github');
	connectWith(ProviderEnum.Github, config);

	await screen.findByText('Votre compte Github');
	await inputAsync('rechercher les repository par valeur', { value: query });
	await formAsync('valider la recherche de repository');
	await screen.findByText('Project1 / Repository1');
	await screen.findByText('Project1 / Repository2');
});
