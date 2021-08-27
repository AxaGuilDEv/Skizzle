import { act, fireEvent, screen } from '@testing-library/svelte';

export const clickButtonAsync = async (name: string | RegExp): Promise<void> => {
	await act(async () => {
		fireEvent.click(await screen.findByRole('button', { name }));
	});
};

export const clickButton = (name: string | RegExp): void => {
	fireEvent.click(screen.getByRole('button', { name }));
};
