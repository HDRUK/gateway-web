import { rest } from 'msw';
import { apiURL } from '../../configs/url.config';

export const mswGetUsers = rest.get(`${apiURL}/users`, (req, res, ctx) => {
	return res(
		ctx.status(200),
		ctx.json({
			data: [
				{ id: 123, name: 'Test1 Test1' },
				{ id: 124, name: 'Test2 Test2' },
			],
		})
	);
});

export const mswGetUserByID = rest.get(`${apiURL}/person/123`, (req, res, ctx) => {
	return res(
		ctx.status(200),
		ctx.json({
			person: { id: 123, firstname: 'Test1', lastname: 'Test1' },
		})
	);
});

export const mswSearchUsers = rest.get(`${apiURL}/users/search/jack`, (req, res, ctx) => {
	return res(
		ctx.status(200),
		ctx.json({
			data: [
				{ id: 123, name: 'Jack Leacher' },
				{ id: 124, name: 'Jack Sparrow' },
			],
		})
	);
});

export default [mswGetUsers, mswGetUserByID, mswSearchUsers];
