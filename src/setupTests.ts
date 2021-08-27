import { configure } from '@testing-library/dom';
import type { OAuthConfigType } from 'providers/OAuthConfig.provider';
import { electron } from 'tests/mocks/setup';
import { needIntro } from 'shared/stores/default.store';

needIntro.set(false);

jest.mock('./shared/token', () => ({
	getToken: jest.fn().mockResolvedValue({
		access_token: 'test'
	} as OAuthConfigType)
}));

jest.mock('./shared/remote', () => electron);

configure({
	getElementError: message => {
		const error = new Error(message ?? "Une erreur s'est produite.");
		error.name = 'TestingLibraryElementError';
		error.stack = undefined;
		return error;
	}
});
