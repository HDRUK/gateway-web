import { rest } from 'msw';
import { apiURL } from '../../configs/url.config';

const mockTeamMembers = {
    members: [
        {
            firstname: 'John',
            lastname: 'Smith',
            id: '5678',
            roles: ['manager'],
            organisation: 'HDR UK',
            bio: 'Developer',
        },
        {
            firstname: 'Jane',
            lastname: 'Doe',
            id: '5678',
            roles: ['manager'],
            organisation: 'Google',
            bio: 'Manager',
        },
    ],
};
const mswGetMembers = rest.get(`${apiURL}/teams/5f7b1a2bce9f65e6ed83e7da/members`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTeamMembers));
});

export default [mswGetMembers];
