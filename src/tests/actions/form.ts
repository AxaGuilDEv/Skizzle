import { act, fireEvent, screen } from '@testing-library/svelte';

export const formAsync = async (key: string): Promise<void> => {
	await act(async () => {
		fireEvent.submit(await screen.findByLabelText(key));
	});
};

export const form = (key: string): void => {
	fireEvent.submit(screen.getByLabelText(key));
};
