const updateSelectedTeam = ({ teamType, teamId }) => {
    localStorage.setItem('teamType', teamType);
    if (!teamId) {
        localStorage.removeItem('teamId');
    } else {
        localStorage.setItem('teamId', teamId);
    }
};

const resetSelectedTeam = () => {
    localStorage.removeItem('teamId');
    localStorage.removeItem('teamType');
};

const getTeam = (teams, teamId) => {
    return teams?.find(team => team._id === teamId);
};

export { getTeam, resetSelectedTeam, updateSelectedTeam };
