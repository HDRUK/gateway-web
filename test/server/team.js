import { rest } from 'msw';
import { teamNotificationsMock, memberNotificationsMock } from '../mocks/teamsServiceMock';
import { apiURL } from '../../src/configs/url.config';

const mswGetTeamNotifications = rest.get(`${apiURL}/teams/1234/notifications`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            memberNotifications: teamNotificationsMock,
            teamNotifications: memberNotificationsMock,
        })
    );
});

export default [mswGetTeamNotifications];
