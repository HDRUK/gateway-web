import { rest } from 'msw';
import { apiUrlV3 } from '../../../../src/configs/url.config';
import { generateMockTeamsMembersV3 } from './data';

const mockTeamsMembersV3 = Array.from({ length: 3 }).map(() => generateMockTeamsMembersV3());

const getTeamsMembersV3 = ({ members = mockTeamsMembersV3 } = {}, status = 200) => {
    return rest.get(`${apiUrlV3}/teams/:id/members`, (req, res, ctx) => {
        return res(ctx.status(status), ctx.json({ members }));
    });
};

const updateTeamsMembersV3 = (data, status = 200) => {
    return rest.patch(`${apiUrlV3}/teams/:id/members/:userId`, (req, res, ctx) => {
        const { params, body } = req;
        return res(ctx.status(status), ctx.json({ members: [{ userId: params.userId, ...body, ...data }] }));
    });
};

const addTeamMembersV3 = (data, status = 200) => {
    return rest.post(`${apiUrlV3}/teams/:id/members`, (req, res, ctx) => {
        const { params, body } = req;
        return res(ctx.status(status), ctx.json({ members: [{ userId: params.userId, ...body, ...data }] }));
    });
};

export { getTeamsMembersV3, mockTeamsMembersV3, updateTeamsMembersV3, addTeamMembersV3 };
