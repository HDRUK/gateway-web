import { ReactNode } from "react";
import ErrorDisplay from "@/components/ErrorDisplay";

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
    const userPermissions = Object.keys(permissions).filter(
        p => permissions[p] === true
    );

    // check if any of the users permissions are in any of the routes permissions
    const userHasPermission = userPermissions.some(p =>
        pagePermissions?.includes(p)
    );

    if (!userHasPermission) {
        return <ErrorDisplay variant={401} />;
    }

    return <> {children} </>;
};

export default ProtectedAccountRoute;
