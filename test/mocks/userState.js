import { PERMISSION_USER_TYPES } from 'consts';

const userStateAdmin = [
    {
        loggedIn: true,
        role: 'Admin',
        id: 6878418568959563,
        name: 'Bill Murray',
        teams: [
            {
                type: 'admin',
                roles: ['admin_dataset', 'admin_data_use'],
            },
            {
                _id: '5f7b1a2bce9f65e2ed83e7da',
                name: 'Other > Mock Publisher',
                roles: ['metadata_editor', 'reviewer'],
                type: 'publisher',
                isAdmin: true,
            },
        ],
        email: 'bill@murray.co.uk',
        profileComplete: true,
        provider: 'google',
        advancedSearchRoles: [],
        terms: true,
    },
];

const userStateManager = [{ email: 'dan@ackroyd.com', teams: [{ _id: '1234', roles: [PERMISSION_USER_TYPES.manager] }] }];

const userStateNonManager = [{ email: 'john@candy.com', teams: [{ _id: '1234', roles: [] }] }];

export { userStateAdmin, userStateManager, userStateNonManager };
