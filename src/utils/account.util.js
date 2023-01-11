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

export { resetSelectedTeam, updateSelectedTeam };
