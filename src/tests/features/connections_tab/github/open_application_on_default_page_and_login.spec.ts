import { render, screen } from '@testing-library/svelte';
import App from 'App.svelte';
import { config as urls } from 'config';
import { ProviderEnum } from 'models/skizzle/ProviderEnum';
import { clickButton, clickButtonAsync } from 'tests/actions/clickButton';
import { connectWith } from 'tests/actions/connection';
import { select } from 'tests/actions/select';
import { GithubProfileBuilder } from 'tests/builders/api/ProfileBuilder';
import { OAuthConfigBuilder } from 'tests/builders/providers/OAuthConfigBuilder';
import { RequesterBuilder } from 'tests/builders/requesters/RequesterBuilder';

test('The application is opened and click on accounts tabs and connect user to github', async () => {
	const profile = new GithubProfileBuilder()
		.withEmail('john.doe@email.com')
		.withName('John Doe')
		.build();

	const config = new OAuthConfigBuilder().withToken('Bearer token').build();

	new RequesterBuilder().get(urls.Github.get.profile(), profile).build();

	render(App, {});

	clickButton('Comptes');

	select('Sélectionner', 'Github');
	await clickButtonAsync('Ajouter un compte Github');
	connectWith(ProviderEnum.Github, config);

	await screen.findByText('Votre compte Github');
	screen.getByText('John Doe');
	screen.getByText('john.doe@email.com');
});
