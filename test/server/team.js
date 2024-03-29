import { rest } from 'msw';
import { teamNotificationsMock, memberNotificationsMock } from '../mocks/teamsServiceMock';
import { apiUrlV1, apiUrlV3 } from '../../src/configs/url.config';

const mswGetTeamNotifications = rest.get(`${apiUrlV1}/teams/1234/notifications`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            memberNotifications: teamNotificationsMock,
            teamNotifications: memberNotificationsMock,
        })
    );
});

const mswGetTeamNotificationsV3 = rest.get(`${apiUrlV3}/teams/1234/notifications`, (req, res, ctx) => {
    return res(
        ctx.status(200),
        ctx.json({
            memberNotifications: teamNotificationsMock,
            teamNotifications: memberNotificationsMock,
        })
    );
});

export default [mswGetTeamNotifications, mswGetTeamNotificationsV3];
