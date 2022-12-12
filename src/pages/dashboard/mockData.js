const userState = [
    {
        loggedIn: true,
        role: 'Admin',
        id: 18612842989752856,
        name: 'Test Test',
        teams: [
            {
                type: 'admin',
                roles: ['admin_dataset'],
            },
            {
                _id: '6107f1607cceaa24a67eefe5',
                name: 'HUBS > Org name test',
                roles: ['metadata_editor'],
                type: 'publisher',
                isAdmin: true,
            },
            {
                _id: '5fc12be363eaab9e68dae76e',
                name: 'NCS > OFFICE FOR NATIONAL STATISTICS',
                roles: ['metadata_editor'],
                type: 'publisher',
                isAdmin: true,
            },
            {
                _id: '6107fd7d7cceaa24a67eefe8',
                name: 'NCS > Team name ',
                type: 'publisher',
                roles: ['manager', 'metadata_editor'],
                isAdmin: true,
            },
        ],
        email: '123@test.com',
        profileComplete: true,
        provider: 'google',
        advancedSearchRoles: [],
        terms: true,
    },
];

module.exports = { userState: userState };
