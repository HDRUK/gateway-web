const ROLES_MANAGER = {
    role: 'Manager',
    rolePlural: 'Managers',
    value: 'manager',
    roleDescription: 'Can add, edit or remove members and resources. Can assign workflows and review applications.',
};

const ROLES_REVIEWER = {
    role: 'Reviewer',
    rolePlural: 'Reviewers',
    value: 'reviewer',
    roleDescription: 'Can review applications assigned to them.',
};

const ROLES_METADATA_EDITOR = {
    role: 'Metadata editor',
    rolePlural: 'Metadata editors',
    value: 'metadata_editor',
    roleDescription: 'Can add and create new versions of datasets',
};

const ROLES_ADMIN = {
    role: 'Admin',
    rolePlural: 'Admins',
    value: 'admin',
    roleDescription:
        'Can manage the existing members of your team, add new members, manage the teams notifications preferences like adding and editing the team email address.',
};

const ROLES_ALL = [ROLES_MANAGER, ROLES_REVIEWER, ROLES_METADATA_EDITOR, ROLES_ADMIN];

export { ROLES_ALL, ROLES_MANAGER, ROLES_REVIEWER, ROLES_METADATA_EDITOR, ROLES_ADMIN };
