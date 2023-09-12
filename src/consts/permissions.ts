import {
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_DAR_REVIEWER,
    ROLE_CUSTODIAN_DEVELOPER,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
} from "./roles";

const permissions = {
    "account.team_management.member.delete": [ROLE_CUSTODIAN_TEAM_ADMIN],
    "account.team_management.permission.update.developer": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
    ],
    "account.team_management.permission.update.custodian_team_admin": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
    ],
    "account.team_management.permission.update.custodian_metadata_manager": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_METADATA_MANAGER,
    ],
    "account.team_management.permission.update.metadata_editor": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_METADATA_MANAGER,
    ],
    "account.team_management.permission.update.custodian_dar_manager": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DAR_MANAGER,
    ],
    "account.team_management.permission.update.reviewer": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DAR_MANAGER,
    ],
    "account.nav.datasets.read": [ROLE_CUSTODIAN_TEAM_ADMIN],
    "account.nav.dar.applications.read": [
        ROLE_CUSTODIAN_DAR_MANAGER,
        ROLE_CUSTODIAN_DAR_REVIEWER,
    ],
    "account.nav.dar.workflows.read": [ROLE_CUSTODIAN_DAR_MANAGER],
    "account.nav.dar.editForm.read": [ROLE_CUSTODIAN_DAR_MANAGER],
    "account.nav.dur.read": [ROLE_CUSTODIAN_DAR_MANAGER],
    "account.nav.integrations.read": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DEVELOPER,
    ],
};

export default permissions;
