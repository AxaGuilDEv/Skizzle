import { render, screen } from '@testing-library/svelte';
import App from 'App.svelte';

test('The application is opened with a login page by default', async () => {
	render(App, {});

	await screen.findByText('Ajouter un compte AzureDevOps');
	const githubConnectionButton = screen.queryByLabelText('Ajouter un compte Github');

	expect(githubConnectionButton).toBeNull();
});
