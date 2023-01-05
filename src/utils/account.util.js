const updateTeamType = ({ teamType, teamId }) => {
    localStorage.setItem('teamType', teamType);
    if (!teamId) {
        localStorage.removeItem('teamId');
    } else {
        localStorage.setItem('teamId', teamId);
    }
};

export { updateTeamType };
