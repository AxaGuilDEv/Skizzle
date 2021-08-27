import type { AzureDevOpsCommentType, GithubCommentApiType } from 'models/api';
import type { CommentType } from 'models/skizzle';
import { getDateStr } from 'shared/utils';
import { From, Mapper } from './Mapper';

export type CommentMapperType = From<AzureDevOpsCommentType, GithubCommentApiType>;

export class CommentMapper extends Mapper<CommentMapperType, CommentType> {
	public to(data: CommentMapperType[], params: any): CommentType[] {
		return data.map(value => {
			const date = new Date(value.updated_at || value.lastUpdatedDate);

			return {
				text: value.body || value.content,
				date: getDateStr(date),
				author: {
					avatar: value.user?.avatar_url || value.author?.descriptor,
					displayName: value.user?.login || value.author?.displayName
				},
				...params
			};
		});
	}
}
