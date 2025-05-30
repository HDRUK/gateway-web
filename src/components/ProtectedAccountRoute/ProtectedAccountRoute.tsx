import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { RouteName } from "@/consts/routeName";
import { hasPermissions } from "@/utils/permissions";

interface ProtectedAccountRouteProps {
    loggedInOnly?: boolean;
    permissions?: { [key: string]: boolean };
    pagePermissions?: string[];
    allowDevOnly?: boolean;
    children: ReactNode;
}

const ProtectedAccountRoute = async ({
    loggedInOnly,
    permissions,
    pagePermissions,
    allowDevOnly = false,
    children,
}: ProtectedAccountRouteProps) => {
    if (loggedInOnly) return children;

    // check if any of the users permissions are in any of the routes permissions
    const userHasPermission =
        permissions && hasPermissions(permissions, pagePermissions);

    if (!userHasPermission && !allowDevOnly) {
        redirect(RouteName.ERROR_403);
    }

    return children;
};

export default ProtectedAccountRoute;
