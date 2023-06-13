import React, { ReactElement } from "react";
import useAuth from "@/hooks/useAuth";
import ProtectedRoute from "../ProtectedRoute";

type AuthRouteCheckProps = {
    children: ReactElement;
    isProtected?: boolean;
};

const AuthRouteCheck = ({ children, isProtected }: AuthRouteCheckProps) => {
    const { isLoggedIn } = useAuth();

    if (isProtected && !isLoggedIn) {
        return <ProtectedRoute />;
    }

    return children;
};

AuthRouteCheck.defaultProps = {
    isProtected: false,
};

export default AuthRouteCheck;
