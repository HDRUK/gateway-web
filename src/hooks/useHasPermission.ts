import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { getPermissions } from "@/hooks/useHasPermission.utils";
import useCustodianRoles from "./useCustodianRoles";
import useAuth from "./useAuth";

interface AccountTeamUrlQuery extends ParsedUrlQuery {
    teamId: string;
}

export const useHasPermissions = () => {
    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;
    const roles = useCustodianRoles(teamId);
    const { user } = useAuth();

    // todo: Return additional roles on user object (ie, hdruk.admin)
    return getPermissions(user?.roles || [], roles.list);
};
