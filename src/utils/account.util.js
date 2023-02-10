const getTeam = (teams, teamId) => {
    return teams?.find(team => team._id === teamId);
};

export { getTeam };
