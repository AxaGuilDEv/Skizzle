import { act, fireEvent, screen } from '@testing-library/svelte';

export function select(name: string, value: string): void {
	const select = screen.getByRole('combobox', { name });

	act(() => {
		fireEvent.change(select, { target: { value } });
	});
}

export async function selectAsync(name: string, value: string): Promise<void> {
	const select = await screen.findByRole('combobox', { name });

	await act(async () => {
		fireEvent.change(select, { target: { value } });
	});
}
