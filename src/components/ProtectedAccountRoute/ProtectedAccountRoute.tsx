import { ReactNode } from "react";
import ErrorDisplay from "@/components/ErrorDisplay";
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
        return <ErrorDisplay variant={401} />;
    }

    return <> {children} </>;
};

export default ProtectedAccountRoute;
