import { rest } from 'msw';
import { apiURL } from '../../configs/url.config';
import { mockUser } from './mockData';
export const mswGetAuthStatus = rest.get(`${apiURL}/auth/status`, (req, res, ctx) => {
	return res(
		ctx.status(200),
		ctx.json({
			...mockUser,
		})
	);
});

export default [mswGetAuthStatus];
