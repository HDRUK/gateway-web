import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { generalUtils } from 'utils';

const useAccountTeamSelected = () => {
    const history = useHistory();
    const location = useLocation();
    const [teamId, setTeamId] = useState();
    const [teamType, setTeamType] = useState();

    const redirectIfNotSet = () => {
        history.push('/account?tab=youraccount&teamType=user');
    };

    useEffect(() => {
        const { search } = location;
        const searchParams = generalUtils.parseQueryString(search);

        if (!searchParams.teamType) {
            redirectIfNotSet();
        }

        setTeamType(searchParams.teamType || 'user');
        setTeamId(searchParams.teamId);
    }, [location]);

    return { teamType, teamId };
};

export default useAccountTeamSelected;
