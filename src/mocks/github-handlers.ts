import { rest } from 'msw';

const url = 'https://api.github.com';

export default [
	rest.get(`${url}/`, (req, res, ctx) => {
		return res(
			ctx.delay(),
			ctx.status(200),
			ctx.json('3D786F84-F07A-4824-922B-010A15D315CB')
		);
	})
];
