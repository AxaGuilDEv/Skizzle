import type { AzureDevOpsProfileApiType, GithubProfileApiType } from 'models/api';
import type { ProfileType } from 'models/skizzle';
import { From, Mapper } from './Mapper';

export type ProfileMapperType = From<AzureDevOpsProfileApiType, GithubProfileApiType>;

export class ProfileMapper extends Mapper<ProfileMapperType, ProfileType> {
	public to(data: ProfileMapperType, params: any): ProfileType {
		let avatar = data.coreAttributes?.Avatar?.value?.value;

		if (avatar) {
			avatar = `data:image/png;base64,${avatar}`;
		} else {
			avatar = data.avatar_url;
		}

		return {
			email: data.email || data.emailAddress,
			id: data.id,
			name: data.name || data.displayName,
			avatar: avatar,
			...params
		};
	}
}
