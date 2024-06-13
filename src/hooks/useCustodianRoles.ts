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

    const [list, setList] = useState<string[]>([]);

    useEffect(() => {
        if (!teamId || !user?.teams?.length) return;

        const team = getTeamById(user?.teams, teamId);
        const roleTypes = getRoleNamesByTeam(team);

        setList([
            ...(roleTypes.includes(ROLE_CUSTODIAN_DEVELOPER)
                ? [ROLE_CUSTODIAN_DEVELOPER]
                : []),
            ...(roleTypes.includes(ROLE_CUSTODIAN_TEAM_ADMIN)
                ? [ROLE_CUSTODIAN_TEAM_ADMIN]
                : []),
            ...(roleTypes.includes(ROLE_CUSTODIAN_METADATA_MANAGER)
                ? [ROLE_CUSTODIAN_METADATA_MANAGER]
                : []),
            ...(roleTypes.includes(ROLE_CUSTODIAN_DAR_MANAGER)
                ? [ROLE_CUSTODIAN_DAR_MANAGER]
                : []),
            ...(roleTypes.includes(ROLE_CUSTODIAN_METADATA_EDITOR)
                ? [ROLE_CUSTODIAN_METADATA_EDITOR]
                : []),
            ...(roleTypes.includes(ROLE_CUSTODIAN_DAR_REVIEWER)
                ? [ROLE_CUSTODIAN_DAR_REVIEWER]
                : []),
        ]);
    }, [teamId, user]);

    return {
        list,
    };
};

export default useCustodianRoles;
