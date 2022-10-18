import { rest } from 'msw';
import { teamNotificationsMock, memberNotificationsMock } from '../mocks/teamsServiceMock';
import { apiURL } from '../../src/configs/url.config';

const mswGetTeamNotifications = rest.get(`${apiURL}/teams/5f7b1a2bce9f65e6ed83e7da/notifications`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            memberNotifications: teamNotificationsMock,
            teamNotifications: memberNotificationsMock,
        })
    );
});

export default [mswGetTeamNotifications];
