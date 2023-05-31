import { rest } from 'msw';
import { teamMembersMock } from '../../../test/mocks/teamsServiceMock';
import { apiUrlV1 } from '../../configs/url.config';

const mswGetMembers = rest.get(`${apiUrlV1}/teams/1234/members`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            members: teamMembersMock,
        })
    );
});

export default [mswGetMembers];
