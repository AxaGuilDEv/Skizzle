import { setupWorker } from 'msw';
import azure from './azure-handlers';
import github from './github-handlers';
const worker = setupWorker(...[...github, ...azure]);

export { worker };
