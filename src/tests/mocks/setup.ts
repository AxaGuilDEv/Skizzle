export const electron = {
	remote: {
		send: jest.fn(),
		receive: jest.fn(),
		once: jest.fn(),
		invoke: jest.fn(),
		openDefaultBrowser: jest.fn(),
		isProduction: jest.fn()
	}
};
