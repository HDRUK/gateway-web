import { rest } from 'msw';
import { ADVANCED_SEARCH_ROLE_GENERAL_ACCESS } from '../../configs/constants';
import { apiUrlV1 } from '../../configs/url.config';

const mswGetUsers = rest.get(`${apiUrlV1}/users`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            data: [
                { id: 12344, name: 'Test1 Test1' },
                { id: 12455, name: 'Test2 Test2' },
                { id: 123, name: 'Jack Reacher' },
            ],
        })
    );
});

const mswGetUserByID = rest.get(`${apiUrlV1}/person/123`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            person: { id: 123, firstname: 'Test1', lastname: 'Test1' },
        })
    );
});

const mswSearchUsers = rest.get(`${apiUrlV1}/users/search/jack`, (req, res, ctx) => {
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

const mswPatchRoles = rest.patch(`${apiUrlV1}/users/advancedsearch/roles/1234`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            response: {
                advancedSearchRoles: [ADVANCED_SEARCH_ROLE_GENERAL_ACCESS],
            },
        })
    );
});

const mswPatchTerms = rest.patch(`${apiUrlV1}/users/advancedsearch/terms/1234`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            response: {
                advancedSearchRoles: [ADVANCED_SEARCH_ROLE_GENERAL_ACCESS],
            },
        })
    );
});

export default [mswGetUsers, mswGetUserByID, mswSearchUsers, mswPatchRoles, mswPatchTerms];
