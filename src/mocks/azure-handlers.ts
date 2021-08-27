import { rest } from 'msw';

const profileAndOrganizationsUrl = 'https://app.vssps.visualstudio.com';
const descriptorAndAvatarUrl = 'https://vssps.dev.azure.com';
const url = 'https://dev.azure.com';

export default [
	rest.get(`${url}/`, (req, res, ctx) => {
		return res(
			ctx.delay(),
			ctx.status(200),
			ctx.json('3D786F84-F07A-4824-922B-010A15D315CB')
		);
	})
];
