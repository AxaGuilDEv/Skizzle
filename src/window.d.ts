export {};

declare global {
	interface Window {
		remote: {
			send: (channel: string, ...args: any) => void;
			receive: (channel: string, func: (...args: any) => void) => void;
			once: (channel: string, func: (...args: any) => void) => void;
			invoke: (channel: string, ...args: any) => any;
			openDefaultBrowser: (url: string) => void;
			isProduction: () => boolean;
		};
	}
}
