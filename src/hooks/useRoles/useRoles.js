import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { accountUtils, roleUtils } from 'utils';

const useRoles = teamId => {
    const { userState } = useAuth();
    const [isReviewer, setIsReviewer] = useState(false);
    const [isMetadataEditor, setIsMetadataEditor] = useState(false);
    const [isCustodianTeamAdmin, setIsCustodianTeamAdmin] = useState(false);
    const [isCustodianMetadataManager, setIsCustodianMetadataManager] = useState(false);
    const [isCustodianDarManager, setIsCustodianDarManager] = useState(false);

    useEffect(() => {
        if (!teamId) return;

        const team = accountUtils.getTeam(userState[0]?.teams, teamId);

        if (!team?.roles) return;

        const { roles } = team;

        setIsReviewer(roleUtils.getIsReviewer(roles));
        setIsMetadataEditor(roleUtils.getIsMetadataEditor(roles));
        setIsCustodianTeamAdmin(roleUtils.getIsCustodianTeamAdmin(roles));
        setIsCustodianMetadataManager(roleUtils.getIsCustodianMetadataManager(roles));
        setIsCustodianDarManager(roleUtils.getIsCustodianDarManager(roles));
    }, [teamId]);

    return {
        isReviewer,
        isMetadataEditor,
        isCustodianTeamAdmin,
        isCustodianMetadataManager,
        isCustodianDarManager,
    };
};

export default useRoles;
