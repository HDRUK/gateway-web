import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const useAccountTeamSelected = () => {
    const history = useHistory();
    const [teamId, setTeamId] = useState();
    const [teamType, setTeamType] = useState();

    const redirectIfNotSet = () => {
        setTeamType(localStorage.setItem('teamType', 'user'));
        history.push('/account?tab=youraccount');
    };

    useEffect(() => {
        const lsTeamType = localStorage.getItem('teamType');
        const lsTeamId = localStorage.getItem('teamId');

        if (!lsTeamType) {
            redirectIfNotSet();
        }

        setTeamType(lsTeamType || 'user');
        setTeamId(lsTeamId);
    }, []);

    return { teamType, teamId };
};

export default useAccountTeamSelected;
