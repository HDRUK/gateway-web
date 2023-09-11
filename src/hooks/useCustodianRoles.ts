import { useEffect, useState } from "react";
import {
    ROLE_CUSTODIAN_DEVELOPER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_METADATA_EDITOR,
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_DAR_REVIEWER,
} from "@/consts/roles";
import { getRoleNamesByTeam, getTeamById } from "@/utils/user";
import useAuth from "./useAuth";

const useCustodianRoles = (teamId: string | undefined) => {
    const { user } = useAuth();

    const [isCustodianDeveloper, setIsCustodianDeveloper] = useState(false);
    const [isCustodianTeamAdmin, setIsCustodianTeamAdmin] = useState(false);
    const [isCustodianMetadataManager, setIsCustodianMetadataManager] =
        useState(false);
    const [isCustodianMetadataEditor, setIsCustodianMetadataEditor] =
        useState(false);
    const [isCustodianDarManager, setIsCustodianDarManager] = useState(false);
    const [isCustodianDarReviewer, setIsCustodianDarReviewer] = useState(false);

    useEffect(() => {
        if (!teamId || !user?.teams?.length) return;

        const team = getTeamById(user?.teams, teamId);
        const roleTypes = getRoleNamesByTeam(team);

        setIsCustodianDeveloper(roleTypes.includes(ROLE_CUSTODIAN_DEVELOPER));
        setIsCustodianTeamAdmin(roleTypes.includes(ROLE_CUSTODIAN_TEAM_ADMIN));
        setIsCustodianMetadataManager(
            roleTypes.includes(ROLE_CUSTODIAN_METADATA_MANAGER)
        );
        setIsCustodianMetadataEditor(
            roleTypes.includes(ROLE_CUSTODIAN_METADATA_EDITOR)
        );
        setIsCustodianDarManager(
            roleTypes.includes(ROLE_CUSTODIAN_DAR_MANAGER)
        );
        setIsCustodianDarReviewer(
            roleTypes.includes(ROLE_CUSTODIAN_DAR_REVIEWER)
        );
    }, [teamId, user]);

    return {
        isCustodianDeveloper,
        isCustodianTeamAdmin,
        isCustodianMetadataManager,
        isCustodianMetadataEditor,
        isCustodianDarManager,
        isCustodianDarReviewer,
    };
};

export default useCustodianRoles;
