import {
	AzureDevOpsReviewApiType,
	AzureDevOpsVoteEnum,
	GithubReviewApiType,
	GithubVoteEnum
} from 'models/api';
import type { ReviewType } from 'models/skizzle';
import { From, Mapper } from './Mapper';

export type ReviewMapperType = From<AzureDevOpsReviewApiType, GithubReviewApiType>;

export class ReviewMapper extends Mapper<ReviewMapperType, ReviewType> {
	public to(data: ReviewMapperType[]): ReviewType {
		return data.reduce((acc, curr) => {
			let key = curr.vote || curr.state || '';

			let result = `${key}`;

			switch (key) {
				case AzureDevOpsVoteEnum.Approved:
				case GithubVoteEnum.Approved:
					result = 'approved';
					break;
				case AzureDevOpsVoteEnum.ApproveWithSuggestions:
					result = 'approvedWithSuggestions';
					break;
				case GithubVoteEnum.Comment:
					result = 'comment';
					break;
				case AzureDevOpsVoteEnum.WaitingForAuthor:
				case GithubVoteEnum.Pending:
					result = 'pending';
					break;
				case AzureDevOpsVoteEnum.Rejected:
					result = 'rejected';
					break;
				case GithubVoteEnum.RequestChange:
					result = 'requestChange';
					break;
				default:
					result = 'others';
					break;
			}

			if (!acc[result]) {
				acc[result] = 0;
			}

			acc[result] = acc[result] + 1;

			return acc;
		}, {} as ReviewType);
	}
}
