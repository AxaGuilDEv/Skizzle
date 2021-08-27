import { act, fireEvent, screen } from '@testing-library/svelte';

export const changeTabAsync = async (tab: string | RegExp): Promise<void> => {
	await act(async () => {
		fireEvent.click(await screen.findByRole('tab', { name: tab }));
	});
};

export const changeTab = (tab: string | RegExp): void => {
	act(() => {
		fireEvent.click(screen.getByRole('tab', { name: tab }));
	});
};
