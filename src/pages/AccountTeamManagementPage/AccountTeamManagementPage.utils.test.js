import {
    getTotalGatewayTeamEmails,
    formatSubscribedEmails,
    getHasMandatoryOptIns,
    getMemberNotification,
    getTeamNotificationType,
    validEmailList,
    hasTeamNotificationOptIns,
} from './AccountTeamManagementPage.utils';

describe('AccountTeamManagement utils', () => {
    describe('getTotalGatewayTeamEmails', () => {
        const subscribedEmails = [
            { value: 'mock value', error: '' },
            { value: 'mock value', error: 'with error' },
            { value: '', error: '' },
        ];
        it('should return false if no OptIn', () => {
            const result = getTotalGatewayTeamEmails([]);
            expect(result).toBe(0);
        });
        it('should return emails if present with no error', () => {
            const result = getTotalGatewayTeamEmails(subscribedEmails);
            expect(result).toBe(1);
        });
    });
    describe('formatSubscribedEmails', () => {
        it('should return empty array if no emails', () => {
            const result = formatSubscribedEmails();
            expect(result).toEqual([]);
        });
        it('should return notifications with empty emails removed', () => {
            const teamNotifications = [
                {
                    subscribedEmails: [{ value: 'mock value 1', error: 'mock error' }],
                    optIn: true,
                    notificationType: 'notificationType1',
                },
                {
                    subscribedEmails: [
                        { value: 'mock value 2', error: '' },
                        { value: '', error: '' },
                    ],
                    optIn: true,
                    notificationType: 'notificationType2',
                },
            ];
            const expectedResult = [
                {
                    subscribedEmails: [{ value: 'mock value 1', error: 'mock error' }],
                    optIn: true,
                    notificationType: 'notificationType1',
                },
                {
                    subscribedEmails: [{ value: 'mock value 2', error: '' }],
                    optIn: true,
                    notificationType: 'notificationType2',
                },
            ];
            const result = formatSubscribedEmails(teamNotifications);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('getHasMandatoryOptIns', () => {
        const teamNotifications = [
            {
                subscribedEmails: [{ value: 'mock value 1', error: 'mock error' }],
                optIn: false,
                notificationType: 'notificationType1',
            },
            {
                subscribedEmails: [
                    { value: 'mock value 2', error: '' },
                    { value: '', error: '' },
                ],
                optIn: true,
                notificationType: 'notificationType2',
            },
        ];
        const memberNotifications = [{ optIn: false, notificationType: 'notificationType1' }];

        it('should return false if no member notifications', () => {
            const result = getHasMandatoryOptIns([], teamNotifications);
            expect(result).toBe(false);
        });
        it('should return true if found missing OptIn', () => {
            const result = getHasMandatoryOptIns(memberNotifications, teamNotifications);
            expect(result).toBe(true);
        });
    });
    describe('getMemberNotification', () => {
        const memberNotifications = [
            { optIn: false, notificationType: 'notificationType1' },
            { optIn: false, notificationType: 'notificationType2' },
        ];

        it('should return index of found notification', () => {
            const notificationType = 'notificationType2';
            const result = getMemberNotification(notificationType, memberNotifications);
            expect(result).toBe(1);
        });
        it('should return -1 if not found', () => {
            const notificationType = 'notificationType3';
            const result = getMemberNotification(notificationType, memberNotifications);
            expect(result).toBe(-1);
        });
    });

    describe('getTeamNotificationType', () => {
        const teamNotifications = [
            {
                subscribedEmails: [{ value: 'mock value 1', error: 'mock error' }],
                optIn: false,
                notificationType: 'notificationType1',
            },
        ];
        it('should return index of found notification', () => {
            const notificationType = 'notificationType1';
            const result = getTeamNotificationType(notificationType, teamNotifications);
            expect(result).toBe(0);
        });
        it('should return -1 if not found', () => {
            const notificationType = 'notificationType3';
            const result = getTeamNotificationType(notificationType, teamNotifications);
            expect(result).toBe(-1);
        });
    });

    describe('validEmailList', () => {
        const teamNotifications = [
            {
                subscribedEmails: [{ value: '', error: 'mock error' }],
                optIn: false,
                notificationType: 'notificationType1',
            },
            {
                subscribedEmails: [
                    { value: 'mock value 2', error: '' },
                    { value: '', error: '' },
                ],
                optIn: true,
                notificationType: 'notificationType2',
            },
        ];
        it('should return empty array if no emails', () => {
            const result = validEmailList();
            expect(result).toEqual([]);
        });
        it('should return list of emails with either a value or an error', () => {
            const result = validEmailList(teamNotifications);
            const expectedResponse = [
                { value: '', error: 'mock error' },
                { value: 'mock value 2', error: '' },
            ];
            expect(result).toEqual(expectedResponse);
        });
    });
    describe('hasTeamNotificationOptIns', () => {
        const teamGatewayNotificationsWithOptIn = [
            {
                subscribedEmails: [{ value: 'mock value', error: 'mock error' }],
                optIn: true,
                notificationType: 'notificationType1',
            },
            {
                subscribedEmails: [{ value: 'mock value', error: 'mock error' }],
                optIn: false,
                notificationType: 'notificationType2',
            },
        ];
        const teamGatewayNotificationsWithoutOptIn = [
            {
                subscribedEmails: [{ value: 'mock value', error: 'mock error' }],
                optIn: false,
                notificationType: 'notificationType2',
            },
        ];
        it('should return false if empty', () => {
            const result = hasTeamNotificationOptIns([]);
            expect(result).toBeFalsy();
        });
        it('should return true if optIn', () => {
            const result = hasTeamNotificationOptIns(teamGatewayNotificationsWithOptIn);
            expect(result).toBeTruthy();
        });
        it('should return false if no OptIn', () => {
            const result = hasTeamNotificationOptIns(teamGatewayNotificationsWithoutOptIn);
            expect(result).toBeFalsy();
        });
    });
});
