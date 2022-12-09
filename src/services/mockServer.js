import { rest } from 'msw';
import { setupServer } from 'msw/node';
import translations from '../../public/locales/en-GB/translation.json';
import mswPostDatasetActivityLog from './activitylog/mockMsw';
import mswGetAuthStatus from './auth/mockMsw';
import mswGetContributors from './contributors/mockMsw';
import mswDatasetOnboarding from './dataset-onboarding/mockMsw';
import mswDatasets from './datasets/mockMsw';
import mswGetLocations from './locations/mockMsw';
import mswGetMembers from './teams/mockMsw';
import mswGetUsers from './users/mockMsw';
import mswGetTeams from '../../test/server/team';
import { getRelatedObjectV1, getRelatedObjectTypeV1 } from '../../test/handlers/relatedResources/v1/handlers';

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
    ...mswGetMembers,
    ...mswGetTeams,
    getRelatedObjectV1(),
    getRelatedObjectTypeV1(),
];

export const server = setupServer.apply(null, handlers);
