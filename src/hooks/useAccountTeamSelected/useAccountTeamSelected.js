import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { accountUtils, generalUtils } from 'utils';

const useAccountTeamSelected = () => {
    const { userState } = useAuth();
    const [user] = userState;
    const history = useHistory();
    const location = useLocation();
    const [teamId, setTeamId] = useState();
    const [teamType, setTeamType] = useState();

    const redirect = () => {
        history.push('/account?tab=youraccount&teamType=user');
    };

    useEffect(() => {
        if (!teamId) return;

        const notWithinTeam = !accountUtils.getTeam(user.teams, teamId);

        if (notWithinTeam) {
            redirect();
        }
    }, [teamId, user]);

    useEffect(() => {
        const { search } = location;
        const searchParams = generalUtils.parseQueryString(search);

        if (!searchParams.teamType) {
            redirect();
        }

        setTeamType(searchParams.teamType || 'user');
        setTeamId(searchParams.teamId);
    }, [location, user]);

    return { teamType, teamId };
};

export default useAccountTeamSelected;
