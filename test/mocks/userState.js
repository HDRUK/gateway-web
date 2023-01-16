import { PERMISSIONS_TEAM_ROLES, ROLE_CUSTODIAN_DAR_MANAGER, ROLE_CUSTODIAN_METADATA_MANAGER, ROLE_CUSTODIAN_TEAM_ADMIN } from 'consts';

const mockUserStateAdmin = [
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

const mockUserStateManager = [{ email: 'dan@ackroyd.com', teams: [{ _id: '1234', roles: [PERMISSIONS_TEAM_ROLES.manager] }] }];
const mockCustodianTeamAdmin = [{ email: 'eddie@murphy.com', teams: [{ _id: '1234', roles: [ROLE_CUSTODIAN_TEAM_ADMIN] }] }];
const mockCustodianDarManager = [{ email: 'leslie@nielson.com', teams: [{ _id: '1234', roles: [ROLE_CUSTODIAN_DAR_MANAGER] }] }];
const mockCustodianMetadataManager = [{ email: 'steve@martin.com', teams: [{ _id: '1234', roles: [ROLE_CUSTODIAN_METADATA_MANAGER] }] }];

const mockUserStateReviewer = [{ email: 'martin@short.com', teams: [{ _id: '5678', roles: [PERMISSIONS_TEAM_ROLES.reviewer] }] }];
const mockUserStateMetadataEditor = [
    { email: 'chevy@chase.com', teams: [{ _id: '9101', roles: [PERMISSIONS_TEAM_ROLES.metadata_editor] }] },
];

const mockUserStateNonManager = [{ email: 'john@candy.com', teams: [{ _id: '1234', roles: [] }] }];

export {
    mockUserStateMetadataEditor,
    mockUserStateReviewer,
    mockUserStateAdmin,
    mockUserStateManager,
    mockUserStateNonManager,
    mockCustodianTeamAdmin,
    mockCustodianDarManager,
    mockCustodianMetadataManager,
};
