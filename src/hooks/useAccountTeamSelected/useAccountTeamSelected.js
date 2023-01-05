import { useEffect, useState } from 'react';

const useAccountTeamSelected = () => {
    const [teamId, setTeamId] = useState();
    const [teamType, setTeamType] = useState();

    useEffect(() => {
        setTeamType(localStorage.getItem('teamType'));
        setTeamId(localStorage.getItem('teamId'));
    }, []);

    return { teamType, teamId };
};

export default useAccountTeamSelected;
