import { electron } from 'tests/mocks/setup';

export class RequesterBuilder {
	private requester = electron.remote.invoke;
	private responses: Record<string, unknown>;

	constructor() {
		this.requester.mockReset();
		this.responses = {};
	}

	get<T>(url: string, response: T): RequesterBuilder {
		this.responses[url] = response;
		return this;
	}

	build(): void {
		this.requester.mockImplementation((channel, args) => {
			const url = JSON.parse(args).url;
			if (channel === 'request' && this.responses[url]) {
				return this.responses[url];
			}
		});
	}
}
