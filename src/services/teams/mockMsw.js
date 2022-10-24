import { rest } from 'msw';
import { teamMembersMock } from '../../../test/mocks/teamsServiceMock';
import { apiURL } from '../../configs/url.config';

const mswGetMembers = rest.get(`${apiURL}/teams/1234/members`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            members: teamMembersMock,
        })
    );
});

export default [mswGetMembers];
