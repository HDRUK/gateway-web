import queryString from 'query-string';
import _ from 'lodash';
import { PERMISSIONS_TEAM_ROLES, PERMISSIONS_ROOT_ROLES, PERMISSIONS_TEAM_MEMBER_ROLES, PERMISSIONS_USER_TYPES } from 'consts';

const getTeam = props => {
    const values = queryString.parse(window.location.search);
    let team;

    if (values.team === 'user') {
        team = 'user';
        localStorage.setItem('HDR_TEAM', 'user');
    } else if (values.team === 'admin') {
        team = 'admin';
        localStorage.setItem('HDR_TEAM', 'admin');
    } else if (!_.isEmpty(values.team)) {
        team = values.team;
        localStorage.setItem('HDR_TEAM', values.team);
    } else if (
        (_.has(props, 'location.state.team') && props.location.state.team !== '') ||
        (_.has(props, 'location.state.publisher') && props.location.state.team !== '')
    ) {
        team = props.location.state.team;
        localStorage.setItem('HDR_TEAM', props.location.state.team);
    } else if (!_.isEmpty(localStorage.getItem('HDR_TEAM'))) {
        team = localStorage.getItem('HDR_TEAM');
    } else {
        team = 'user';
        localStorage.setItem('HDR_TEAM', 'user');
    }

    return team;
};

const getIsTypeCustodian = type => {
    return type !== 'user' && type !== 'admin';
};

const getIsTypeAdmin = type => {
    return type === 'admin';
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

const getIsUserRoleAdmin = role => {
    return role === PERMISSIONS_ROOT_ROLES.admin;
};

const getIsUserRoleDataCustodian = role => {
    return role === PERMISSIONS_ROOT_ROLES.data_custodian;
};

const getIsUserRoleCreator = role => {
    return role === PERMISSIONS_ROOT_ROLES.creator;
};

// TODO: GAT-1510 No need to refactor - page being removed
const userHasTeamRole = (userState, teamId, role) => {
    const team = userState[0]?.teams.filter(t => {
        // eslint-disable-next-line no-underscore-dangle
        return t._id === teamId;
    })[0];
    return team && team.roles.some(r => role.includes(r));
};

// TODO: GAT-1510 No need to refactor - page being removed
const getIsTeamAdmin = (userState, publisherId) => {
    // eslint-disable-next-line no-underscore-dangle
    const found = userState[0]?.teams.find(team => publisherId === team._id && team.isAdmin);
    return !!found;
};

const getTeamMemberManagers = (members = []) => {
    return members.filter(member => member?.roles?.includes(PERMISSIONS_TEAM_MEMBER_ROLES.manager));
};

const isTeamMemberManager = (userState, members = []) => {
    return members.filter(m => m.id === userState[0].id).map(m => m.roles[0] === 'manager')[0];
};

const getTeamRoleNames = roles => {
    const sortedRoles = (roles || []).sort();

    const roleNames = {
        manager: 'Manager',
        reviewer: 'Reviewer',
        metadata_editor: 'Metadata Editor',
    };

    // TODO: GAT-1510:043
    return sortedRoles.map(role => roleNames[role]).join(', ');
};

const isTeamAdminNotManager = (teamId, userState) => {
    const team = userState[0].teams.filter(t => {
        // eslint-disable-next-line no-underscore-dangle
        return t._id === teamId;
    })[0];
    return team && team.isAdmin && !team.roles.includes(PERMISSIONS_TEAM_ROLES.manager);
};

// TODO: GAT-1510 Investigate - this does not always return a value
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
};

// TODO: GAT-1510 Investigate - this returns both PERMISSIONS_USER_TYPES and PERMISSIONS_TEAM_ROLES
const returnApplicantIfTeamNotFound = (userState, teamId) => {
    const { teams } = userState[0];
    const foundTeam = teams.filter(team => team.name === teamId);
    if (_.isEmpty(teams) || _.isEmpty(foundTeam)) {
        return [PERMISSIONS_USER_TYPES.applicant];
    }
    return foundTeam[0].roles;
};

// TODO: GAT-1510 Investigate - similar to getIsTypeAdminOrApplicant above
const getPublisherId = (userState, team) => {
    const { teams } = userState;
    const foundAdmin = teams.filter(x => x.type === team);

    if (!_.isEmpty(foundAdmin)) {
        return 'admin';
    }

    // eslint-disable-next-line no-underscore-dangle
    const foundTeam = teams.filter(x => x._id === team);
    if (_.isEmpty(teams) || _.isEmpty(foundTeam)) {
        return ['applicant'];
    }

    // eslint-disable-next-line no-underscore-dangle
    return foundTeam[0]._id;
};

export {
    getPublisherId,
    returnApplicantIfTeamNotFound,
    isTeamMemberManager,
    getIsTypeAdminOrApplicant,
    getTeamMemberManagers,
    getIsRootRoleAdmin,
    getTeamRoleNames,
    getTeam,
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
};
