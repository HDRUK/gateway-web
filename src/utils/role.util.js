import { ROLE_CUSTODIAN_DAR_MANAGER, ROLE_CUSTODIAN_METADATA_MANAGER, ROLE_CUSTODIAN_TEAM_ADMIN } from 'consts';

const getIsTeamAdmin = (team = {}) => {
    const { roles } = team;
    if (!Array.isArray(roles)) return false;
    return roles.some(role => [ROLE_CUSTODIAN_TEAM_ADMIN].includes(role));
};

const getIsTeamAdminOrManager = (team = {}) => {
    const { roles } = team;
    if (!Array.isArray(roles)) return false;
    return roles.some(role => [ROLE_CUSTODIAN_DAR_MANAGER, ROLE_CUSTODIAN_METADATA_MANAGER, ROLE_CUSTODIAN_TEAM_ADMIN].includes(role));
};

export { getIsTeamAdmin, getIsTeamAdminOrManager };
