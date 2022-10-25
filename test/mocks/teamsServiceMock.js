const teamMembers = [
    {
        firstname: 'John',
        lastname: 'Smith',
        id: 5678,
        roles: ['manager'],
        organisation: 'HDR UK',
        bio: 'Developer',
    },
    {
        firstname: 'Jane',
        lastname: 'Doe',
        id: 1234,
        roles: ['manager'],
        organisation: 'Google',
        bio: 'Manager',
    },
];
const teamNotifications = [
    {
        subscribedEmails: [{ value: 'a value', error: '' }],
        optIn: true,
        notificationType: 'notification1',
    },
    {
        subscribedEmails: [
            { value: 'a value', error: 'an error' },
            { value: 'another value', error: '' },
        ],
        optIn: true,
        notificationType: 'notification2',
    },
    {
        subscribedEmails: [{ value: 'a value', error: 'an error' }],
        optIn: false,
        notificationType: 'notification3',
    },
];

const memberNotifications = [];

module.exports = {
    teamMembersMock: teamMembers,
    teamNotificationsMock: teamNotifications,
    memberNotificationsMock: memberNotifications,
};
