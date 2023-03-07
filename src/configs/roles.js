const ROLES_REVIEWER = {
    label: 'Data Access Request Reviewer',
    rolePlural: 'Data Access Request Reviewers',
    value: 'reviewer',
    tooltipLabel: 'Reviewers',
    tooltipDescription: 'Can review applications assigned to them.',
    description: 'Can review sections of data access request applications that have been assigned to them through workflows.',
};

const ROLES_METADATA_EDITOR = {
    label: 'Metadata editor',
    rolePlural: 'Metadata editors',
    value: 'metadata_editor',
    tooltipLabel: 'Editors',
    tooltipDescription: 'Can add and create new versions of datasets.',
    description: 'Can create and edit dataset metadata.',
};

const ROLES_TEAM_ADMIN = {
    label: 'Team Admin',
    rolePlural: 'Team Admins',
    value: 'custodian.team.admin',
    tooltipLabel: 'Admins',
    tooltipDescription:
        'Can manage the existing members of your team, add new members, manage the teams notifications preferences like adding and editing the team email address.',
    description: 'Can add or remove team members, and edit their roles.',
};

const ROLES_DAR_MANAGER = {
    label: 'Data Access Request Manager',
    rolePlural: 'Data Access Request Managers',
    value: 'custodian.dar.manager',
    tooltipLabel: 'Managers',
    tooltipDescription: 'Can add, edit or remove members and resources. Can assign workflows and review applications.',
    description:
        'Can review data access request applications, assign workflows to other team members, and edit team roles related to data access requests.',
};

const ROLES_METADATA_MANAGER = {
    label: 'Metadata Manager',
    rolePlural: 'Metadata Managers',
    value: 'custodian.metadata.manager',
    tooltipLabel: 'Managers',
    tooltipDescription: 'Can add, edit or remove members and resources. Can assign workflows and review applications.',
    description: 'Can create and edit dataset metadata, and edit team roles related to dataset metadata.',
};

export { ROLES_METADATA_MANAGER, ROLES_DAR_MANAGER, ROLES_REVIEWER, ROLES_METADATA_EDITOR, ROLES_TEAM_ADMIN };
