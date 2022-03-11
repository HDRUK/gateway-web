import { setupServer } from 'msw/node';
import { rest } from 'msw';
import mswDatasets from './datasets/mockMsw';
import mswDatasetOnboarding from './dataset-onboarding/mockMsw';
import mswPostDatasetActivityLog from './activitylog/mockMsw';
import mswSearch from './search/mockMsw';
import mswGetLocations from './locations/mockMsw';
import mswGetContributors from './contributors/mockMsw';
import mswGetAuthStatus from './auth/mockMsw';
import mswGetUsers from './users/mockMsw';

import translations from '../../public/locales/en-GB/translation.json';

const mswGetEnTranslations = rest.get(`http://localhost/locales/en/translation.json`, (req, res, ctx) => {
	return res(ctx.status(200), ctx.json(translations));
});

const mswGetEnGbTranslations = rest.get(`http://localhost/locales/en-GB/translation.json`, (req, res, ctx) => {
	return res(ctx.status(200), ctx.json(translations));
});

const mswGetIcon = rest.get(`/images/Application_approved.svg`, (req, res, ctx) => {
	return res(ctx.status(200), ctx.text('<svg />'));
});

const handlers = [
	...mswDatasets,
	...mswDatasetOnboarding,
	...mswPostDatasetActivityLog,
	// ...mswSearch,
	...mswGetLocations,
	...mswGetContributors,
	...mswGetAuthStatus,
	...mswGetUsers,
	mswGetEnTranslations,
	mswGetEnGbTranslations,
	mswGetIcon,
];

export const server = setupServer(...handlers);
