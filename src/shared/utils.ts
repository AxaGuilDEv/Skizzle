import type { CustomListType, PullRequestType } from 'models/skizzle';
import { notifications, profiles } from 'shared/stores/default.store';
import { get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { remote } from './remote';

export const addItem = <T>(key: string, value: T): void =>
	localStorage.setItem(key, JSON.stringify(value));

export const removeItem = (key: string): void => localStorage.removeItem(key);

export const removeItems = (keys: string[]): void => keys.forEach(key => removeItem(key));

export const getItem = <T>(key: string): T => JSON.parse(localStorage.getItem(key)) as T;

export const existValue = <T>(items: T[], value: T) =>
	!!items && items.some(x => x === value);

export type Dictionary<T> = {
	[Key: string]: T;
};

export const getDateStr = (date: Date): string => {
	const diffDays = getDiffDays(date);
	const hours = `${date.getHours()}`.padStart(2, '0');
	const minutes = `${date.getMinutes()}`.padStart(2, '0');

	switch (diffDays) {
		case 0:
			return `Aujourd'hui à ${hours}:${minutes}`;
		case 1:
			return 'Hier';
		default:
			return `il y a ${diffDays} jours`;
	}
};

export const getDiffDays = (date: Date): number => {
	const today = new Date();
	const oneDay = 24 * 60 * 60 * 1000;
	return Math.round(Math.abs((date.getTime() - today.getTime()) / oneDay));
};

export const copyToClipboard = async (data: string, message: string) => {
	const result: boolean = await remote.invoke('copy-to-clipboard', data);
	if (result) {
		notifications.update(notifications => [
			...notifications,
			{
				text: message,
				id: uuidv4()
			}
		]);
	}
};

export const isJson = (str: string): boolean => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

export const getLabelsFrom = (pullRequests: PullRequestType[]): string[] => {
	return pullRequests.reduce((acc, curr) => {
		const result = (curr.labels || [])
			.map(value => {
				if (value?.name && !acc.includes(value.name)) {
					return value.name;
				}
			}, [])
			.filter(x => x);

		return [...acc, ...result];
	}, []);
};

export const getPullRequestsFromCustomSettings = (
	pullRequests: PullRequestType[],
	settings: CustomListType
): PullRequestType[] => {
	return pullRequests
		.filter(pr => !settings.provider || settings.provider === pr.provider)
		.filter(pr => !settings.repositoryId || settings.repositoryId === pr.repositoryId)
		.filter(
			pr =>
				settings.tags.length === 0 ||
				settings.tags.some(x => (pr.labels ?? []).some(y => y.name === x))
		)
		.filter(
			pr =>
				!settings.withoutOwnedByUserPR ||
				(settings.withoutOwnedByUserPR &&
					pr.user.id &&
					get(profiles).find(x => x.provider === pr.provider)?.id !== pr.user.id)
		)
		.filter(
			pr =>
				!settings.withoutOldPR ||
				(settings.withoutOldPR && pr.date && getDiffDays(new Date(pr.date)) < 30)
		)
		.filter(pr => !settings.withoutConflict || (settings.withoutConflict && !pr.isConflict))
		.filter(pr => !settings.withoutDraft || (settings.withoutDraft && !pr.isDraft))
		.filter(
			pr =>
				!settings.withoutCheckedByOwner || (settings.withoutCheckedByOwner && !pr.hasReviewed)
		);
};
