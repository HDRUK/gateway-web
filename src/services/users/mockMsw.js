import { rest } from 'msw';
import { ADVANCED_SEARCH_ROLE_GENERAL_ACCESS } from '../../configs/constants';
import { apiURL } from '../../configs/url.config';

export const mswGetUsers = rest.get(`${apiURL}/users`, (req, res, ctx) => {
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

export const mswPatchRoles = rest.patch(`${apiURL}/users/advancedsearch/roles/1234`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            response: {
                advancedSearchRoles: [ADVANCED_SEARCH_ROLE_GENERAL_ACCESS],
            },
        })
    );
});

export const mswPatchTerms = rest.patch(`${apiURL}/users/advancedsearch/terms/1234`, (req, res, ctx) => {
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
