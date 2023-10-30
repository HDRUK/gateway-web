import { ReactNode } from "react";
import { useHasPermissions } from "@/hooks/useHasPermission";
import ErrorDisplay from "@/components/ErrorDisplay";

interface ProtectedRouteProps {
    permissions?: string[];
    children: ReactNode;
}

const ProtectedRoute = ({
    permissions: routePermissions,
    children,
}: ProtectedRouteProps) => {
    const permissions = useHasPermissions();
    const userPermissions = Object.keys(permissions).filter(
        p => permissions[p] === true
    );

    // check if any of the users permissions are in any of the routes permissions
    const userHasPermission = userPermissions.some(p =>
        routePermissions?.includes(p)
    );

    if (!userHasPermission) {
        return <ErrorDisplay variant={401} />;
    }

    return <> {children} </>;
};

export default ProtectedRoute;
