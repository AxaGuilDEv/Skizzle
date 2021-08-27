import type {
	CommonType,
	CustomListType,
	PullRequestType,
	RepositoryType,
	SettingsType,
	NotificationType,
	ProfileType
} from 'models/skizzle';
import { ThemeEnum, ProviderEnum } from 'models/skizzle';
import { Service } from 'services/Service';
import { get } from 'svelte/store';
import { createStore } from './store';
import { v4 as uuidv4 } from 'uuid';
import { remote } from 'shared/remote';

const predicate = <T extends CommonType>(value: T[], provider: ProviderEnum): T[] => {
	return value.filter(x => x.provider !== provider);
};

export const refreshPullRequests = async () => {
	const isOffline = get(offline);

	if (!isOffline) {
		const values = get(repositories);

		if (values.length > 0) {
			let oldValues = get(pullRequests);

			let result: PullRequestType[] = [];

			try {
				for (const repository of values) {
					result = result.concat(
						await Service.getPullRequests(repository.provider, { repository })
					);
				}
			} catch {
				return;
			}

			const newValues = result.filter(
				pullRequest =>
					!oldValues.some(({ pullRequestId }) => pullRequest.pullRequestId === pullRequestId)
			);

			if (newValues.length > 0) {
				let title =
					newValues.length > 1
						? 'De nouvelles pull requests sont disponibles'
						: 'Une nouvelle pull request est disponible';

				let body =
					newValues.length > 1
						? 'Plusieurs repositories ont étés mis à jour'
						: `Le repo ${newValues[0].repositoryName} a une nouvelle pull request`;

				remote.send('notifier', {
					title,
					body
				});
			}
			0;

			pullRequests.reset();
			pullRequests.set(result.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
		}
	}
};

export const profiles = createStore<ProfileType[]>([], { key: 'profiles' });
export const pullRequests = createStore<PullRequestType[]>([], {
	key: 'pullRequests',
	predicate
});
export const repositories = createStore<RepositoryType[]>([], {
	key: 'repositories',
	predicate
});
export const isLoading = createStore<boolean>(false, {});
export const isFetchingData = createStore<boolean>(false, {});
export const notifications = createStore<NotificationType[]>([], {});
export const offline = createStore<boolean>(false, {
	key: 'offline',
	subscriber: () => (offline: boolean) => {
		if (offline) {
			notifications.update(notifications => [
				...notifications,
				{
					text: 'Vous êtes actuellement deconnecté',
					id: uuidv4()
				}
			]);
		}
	}
});
export const settings = createStore<SettingsType>(
	{
		refresh_delay: 5,
		launch_at_startup: false,
		proxy: '',
		theme: ThemeEnum.Orange,
		language: 'en',
		compact: false
	},
	{
		key: 'settings',
		subscriber: initialValue => settings => {
			if (settings.refresh_delay > 0) {
				setInterval(refreshPullRequests, settings.refresh_delay * 60000);
			}

			Object.keys(initialValue).forEach(element => {
				let property = settings[element];

				if (!property) {
					settings[element] = initialValue[element];
				}
			});

			remote.send('launch-startup', settings.launch_at_startup);
		}
	}
);
export const customLists = createStore<CustomListType[]>([], {
	key: 'customLists'
});

export const needIntro = createStore<boolean>(true, { key: 'needIntro' });
