import _ from 'lodash';

import { PERMISSIONS_TEAM_ROLES, PERMISSIONS_ROOT_ROLES, PERMISSIONS_TEAM_MEMBER_ROLES, PERMISSIONS_USER_TYPES } from 'consts';

const getIsTypeCustodian = type => {
    return type !== 'user' && type !== 'admin';
};

/* type="admin" for HDRUK team */
const getIsTypeAdmin = type => {
    return type === 'admin';
};

const getIsTypeTeam = type => {
    return type === 'team';
};

const getIsTypeUser = type => {
    return type === 'user';
};

const getIsTypePublisher = type => {
    return type === 'publisher';
};

const getIsRootRoleAdmin = userState => {
    return userState[0].role === PERMISSIONS_ROOT_ROLES.admin;
};

const getIsHDRAdmin = userState => {
    return !!userState[0].teams?.find(team => getIsTypeAdmin(team.type));
};

const getIsUserRoleAdmin = role => {
    return role === PERMISSIONS_ROOT_ROLES.admin;
};

const getIsUserRoleDataCustodian = role => {
    return role === PERMISSIONS_ROOT_ROLES.data_custodian;
};

const getIsUserRoleCreator = role => {
    return role === PERMISSIONS_ROOT_ROLES.creator;
};

const userHasTeamRole = (userState, teamId, role) => {
    const team = userState[0]?.teams.filter(t => {
        // eslint-disable-next-line no-underscore-dangle
        return t._id === teamId;
    })[0];

    return team && team.roles.some(r => role.includes(r));
};

const getHasTeamManagerRole = (userState, teamId) => {
    const team = userState[0]?.teams.filter(t => {
        // eslint-disable-next-line no-underscore-dangle
        return t._id === teamId;
    })[0];
    return team && team.roles.some(r => PERMISSIONS_TEAM_ROLES.manager.includes(r));
};

const getIsTeamAdmin = (userState, teamId) => {
    // eslint-disable-next-line no-underscore-dangle
    const found = userState[0]?.teams.find(team => teamId === team._id && team.isAdmin);
    return !!found;
};

const getTeamMemberManagers = (members = []) => {
    return members.filter(member => member?.roles?.includes(PERMISSIONS_TEAM_MEMBER_ROLES.manager));
};

const isTeamAdminNotManager = (teamId, userState) => {
    const team = userState[0].teams.filter(t => {
        // eslint-disable-next-line no-underscore-dangle
        return t._id === teamId;
    })[0];
    return team && team.isAdmin && !team.roles.includes(PERMISSIONS_TEAM_ROLES.manager);
};

const getIsTypeAdminOrApplicant = (userState, teamId) => {
    const { teams } = userState[0];

    const foundAdmin = teams.filter(x => x.type === PERMISSIONS_USER_TYPES.admin);
    if (!_.isEmpty(foundAdmin)) {
        return [PERMISSIONS_USER_TYPES.admin];
    }

    const foundTeam = teams.filter(team => team.name === teamId);
    if (_.isEmpty(teams) || _.isEmpty(foundTeam)) {
        return [PERMISSIONS_USER_TYPES.applicant];
    }

    return [];
};

const returnApplicantIfTeamNotFound = (userState, teamId) => {
    const { teams } = userState[0];
    const foundTeam = teams.filter(team => team.name === teamId);
    if (_.isEmpty(teams) || _.isEmpty(foundTeam)) {
        return [PERMISSIONS_USER_TYPES.applicant];
    }
    return foundTeam[0].roles;
};

const getPublisherId = (userState, teamId, teamType) => {
    const { teams } = userState;
    const foundAdmin = teams.filter(x => x.type === teamType);

    if (!_.isEmpty(foundAdmin)) {
        return 'admin';
    }

    // eslint-disable-next-line no-underscore-dangle
    const foundTeam = teams.filter(x => x._id === teamId);
    if (_.isEmpty(teams) || _.isEmpty(foundTeam)) {
        return ['applicant'];
    }

    // eslint-disable-next-line no-underscore-dangle
    return foundTeam[0]._id;
};

export {
    getIsTypeTeam,
    getHasTeamManagerRole,
    getPublisherId,
    returnApplicantIfTeamNotFound,
    getIsTypeAdminOrApplicant,
    getTeamMemberManagers,
    getIsTypePublisher,
    getIsTypeCustodian,
    getIsTypeAdmin,
    getIsTypeUser,
    getIsTeamAdmin,
    userHasTeamRole,
    isTeamAdminNotManager,
    getIsUserRoleAdmin,
    getIsUserRoleDataCustodian,
    getIsUserRoleCreator,
    getIsRootRoleAdmin,
    getIsHDRAdmin,
};
