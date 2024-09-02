import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { RouteName } from "@/consts/routeName";
import { hasPermissions } from "@/utils/permissions";

interface ProtectedAccountRouteProps {
    permissions: { [key: string]: boolean };
    pagePermissions?: string[];
    children: ReactNode;
}

const ProtectedAccountRoute = ({
    permissions,
    pagePermissions,
    children,
}: ProtectedAccountRouteProps) => {
    // check if any of the users permissions are in any of the routes permissions
    const userHasPermission = hasPermissions(permissions, pagePermissions);

    if (!userHasPermission) {
        redirect(RouteName.ERROR_403);
    }

    return <>{children}</>;
};

export default ProtectedAccountRoute;
