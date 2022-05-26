import queryString from 'query-string';
import _ from 'lodash';

export const getTeam = props => {
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

export const isCustodian = team => {
    return team !== 'user' && team !== 'admin';
};

export const isAdmin = team => {
    return team === 'admin';
};

export const isUser = team => {
    return team === 'user';
};
