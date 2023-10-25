import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import protectedRoutes from "@/config/protectedRoutes";
import { useHasPermissions } from "@/hooks/useHasPermission";
import Unauthorised from "@/components/Unauthorised";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const router = useRouter();
    const { asPath } = router;

    const permissions = useHasPermissions();

    const protectedRoute = protectedRoutes.find(item => {
        const routePattern = item.route.replace(/\*/g, ".*");
        const regex = new RegExp(`^${routePattern}$`);
        return regex.test(asPath);
    });

    if (!protectedRoute) {
        return <> {children} </>;
    }

    const routePermissions = protectedRoute.permissions;
    const userPermissions = Object.keys(permissions).filter(
        p => permissions[p] === true
    );

    //check if any of the users permissions are in any of the routes permissions
    const userHasPermission = userPermissions.some(p =>
        routePermissions.includes(p)
    );

    if (!userHasPermission) {
        return (
            <>
                <Unauthorised />
            </>
        );
    }

    return <> {children} </>;
};

export default ProtectedRoute;
