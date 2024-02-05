import {
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
} from "./roles";

const fePermissions = {
    // Needs to replace this with a list of more granular roles (custodians.update only allows custodian team admin)
    "fe.account.team_management.member.add": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DAR_MANAGER,
        ROLE_CUSTODIAN_METADATA_MANAGER,
    ],
    // replace as discussed
    "fe.account.team_management.member.add.developer": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
    ],
    // replace as discussed
    "fe.account.team_management.member.add.custodian_team_admin": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
    ],
    // replace as discussed
    "fe.account.team_management.member.add.custodian_metadata_manager": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_METADATA_MANAGER,
    ],
    // replace as discussed
    "fe.account.team_management.member.add.metadata_editor": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_METADATA_MANAGER,
    ],
    // replace as discussed
    "fe.account.team_management.member.add.custodian_dar_manager": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DAR_MANAGER,
    ],
    // replace as discussed
    "fe.account.team_management.member.add.reviewer": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DAR_MANAGER,
    ],
    // replace as discussed
    "fe.account.team_management.permission.update.developer": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
    ],
    // replace as discussed
    "fe.account.team_management.permission.update.custodian_team_admin": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
    ],
    // replace as discussed
    "fe.account.team_management.permission.update.custodian_metadata_manager": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_METADATA_MANAGER,
    ],
    // replace as discussed
    "fe.account.team_management.permission.update.metadata_editor": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_METADATA_MANAGER,
    ],
    // replace as discussed
    "fe.account.team_management.permission.update.custodian_dar_manager": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DAR_MANAGER,
    ],
    // replace as discussed
    "fe.account.team_management.permission.update.reviewer": [
        ROLE_CUSTODIAN_TEAM_ADMIN,
        ROLE_CUSTODIAN_DAR_MANAGER,
    ],
};

export { fePermissions };
