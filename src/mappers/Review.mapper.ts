import {
	AzureDevOpsReviewApiType,
	AzureDevOpsVoteEnum,
	GithubReviewApiType,
	GithubVoteEnum,
} from 'models/api';
import type { ReviewType } from 'models/skizzle';
import { From, Mapper } from './Mapper';

export type ReviewMapperType = From<
	AzureDevOpsReviewApiType,
	GithubReviewApiType
>;

export class ReviewMapper extends Mapper<ReviewMapperType, ReviewType> {
	public to(data: ReviewMapperType[]): ReviewType {
		return data.reduce((acc, curr) => {
			let key = curr.vote || curr.state;
			let result = key.toString();

			switch (key) {
				case AzureDevOpsVoteEnum.Approved:
				case GithubVoteEnum.Approved:
					result = 'Validée';
					break;
				case AzureDevOpsVoteEnum.ApproveWithSuggestions:
					result = 'Validée avec suggestion(s)';
					break;
				case GithubVoteEnum.Comment:
					result = 'Commentaire(s)';
					break;
				case AzureDevOpsVoteEnum.WaitingForAuthor:
				case GithubVoteEnum.Pending:
					result = 'En attente';
					break;
				case AzureDevOpsVoteEnum.Rejected:
					result = 'Refusée';
					break;
				case GithubVoteEnum.RequestChange:
					result = 'Demande de changement';
					break;
				default:
					result = "Pas d'avis";
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