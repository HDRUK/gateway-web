const teamMembers = [
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
];
const teamNotifications = [];
const memberNotifications = [];

module.exports = {
    teamMembersMock: teamMembers,
    teamNotificationsMock: teamNotifications,
    memberNotificationsMock: memberNotifications,
};
