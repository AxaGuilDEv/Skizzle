import { act, fireEvent, screen } from '@testing-library/svelte';

type TargetType = {
	value?: string;
	checked?: boolean;
};

export const inputAsync = async (key: string, target: TargetType): Promise<void> => {
	await act(async () => {
		fireEvent.input(await screen.findByLabelText(key), { target: { ...target } });
	});
};

export const input = (key: string, target: TargetType): void => {
	fireEvent.input(screen.getByLabelText(key), { target: { ...target } });
};
