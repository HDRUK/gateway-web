import {
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_DAR_REVIEWER,
    ROLE_CUSTODIAN_DEVELOPER,
    ROLE_CUSTODIAN_METADATA_EDITOR,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
} from "./roles";

const fePermissions = {
    "fe.account.team_management.notifications.team_section": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
    ],
    "fe.account.team_management.member.add": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DAR_MANAGER,
        ROLE_CUSTODIAN_METADATA_MANAGER,
    ],
    "fe.account.team_management.member.add.developer": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
    ],
    "fe.account.team_management.member.add.custodian_team_admin": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
    ],
    "fe.account.team_management.member.add.custodian_metadata_manager": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_METADATA_MANAGER,
    ],
    "fe.account.team_management.member.add.metadata_editor": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_METADATA_MANAGER,
    ],
    "fe.account.team_management.member.add.custodian_dar_manager": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DAR_MANAGER,
    ],
    "fe.account.team_management.member.add.reviewer": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DAR_MANAGER,
    ],
    "fe.account.team_management.member.delete": [ROLE_CUSTODIAN_TEAM_ADMIN],
    "fe.account.team_management.permission.update.developer": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
    ],
    "fe.account.team_management.permission.update.custodian_team_admin": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
    ],
    "fe.account.team_management.permission.update.custodian_metadata_manager": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_METADATA_MANAGER,
    ],
    "fe.account.team_management.permission.update.metadata_editor": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_METADATA_MANAGER,
    ],
    "fe.account.team_management.permission.update.custodian_dar_manager": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DAR_MANAGER,
    ],
    "fe.account.team_management.permission.update.reviewer": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DAR_MANAGER,
    ],
    "fe.account.nav.datasets": [
        ROLE_CUSTODIAN_METADATA_MANAGER,
        ROLE_CUSTODIAN_METADATA_EDITOR,
    ],
    "fe.account.nav.dar.applications": [
        ROLE_CUSTODIAN_DAR_MANAGER,
        ROLE_CUSTODIAN_DAR_REVIEWER,
    ],
    "fe.account.nav.dar.workflows": [ROLE_CUSTODIAN_DAR_MANAGER],
    "fe.account.nav.dar.editForm": [ROLE_CUSTODIAN_DAR_MANAGER],
    "fe.account.nav.dur": [ROLE_CUSTODIAN_DAR_MANAGER],
    "fe.account.nav.integrations.api-management": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DEVELOPER,
    ],
    "fe.account.nav.integrations.integration": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DEVELOPER,
    ],
};

export { fePermissions };
