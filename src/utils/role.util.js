import { PERMISSIONS_TEAM_ROLES, ROLE_CUSTODIAN_DAR_MANAGER, ROLE_CUSTODIAN_METADATA_MANAGER, ROLE_CUSTODIAN_TEAM_ADMIN } from 'consts';

const getIsCustodianTeamAdmin = roles => {
    if (!Array.isArray(roles)) return false;
    return roles.some(role => [ROLE_CUSTODIAN_TEAM_ADMIN].includes(role));
};

const getIsReviewer = roles => {
    if (!Array.isArray(roles)) return false;
    return roles.some(role => [PERMISSIONS_TEAM_ROLES.reviewer].includes(role));
};

const getIsMetadataEditor = roles => {
    if (!Array.isArray(roles)) return false;
    return roles.some(role => [PERMISSIONS_TEAM_ROLES.metadata_editor].includes(role));
};

const getIsCustodianMetadataManager = roles => {
    if (!Array.isArray(roles)) return false;
    return roles.some(role => [ROLE_CUSTODIAN_METADATA_MANAGER].includes(role));
};

const getIsCustodianDarManager = roles => {
    if (!Array.isArray(roles)) return false;
    return roles.some(role => [ROLE_CUSTODIAN_DAR_MANAGER].includes(role));
};
const getIsCustodianAdminOrManager = roles => {
    if (!Array.isArray(roles)) return false;
    return roles.some(role => [ROLE_CUSTODIAN_DAR_MANAGER, ROLE_CUSTODIAN_METADATA_MANAGER, ROLE_CUSTODIAN_TEAM_ADMIN].includes(role));
};

export {
    getIsCustodianDarManager,
    getIsCustodianMetadataManager,
    getIsMetadataEditor,
    getIsCustodianTeamAdmin,
    getIsReviewer,
    getIsCustodianAdminOrManager,
};
