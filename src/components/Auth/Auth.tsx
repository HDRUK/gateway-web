import React, { ReactElement } from "react";
import useUser from "@/hooks/useUser";
import ProtectedRoute from "../ProtectedRoute";
import Loading from "../Loading";

type AuthProps = {
    children: ReactElement;
    isProtected?: boolean;
};

const Auth = ({ children, isProtected }: AuthProps) => {
    const { isLoggedIn, isLoading } = useUser();

    if (isLoading) return <Loading />;

    if (isProtected && !isLoggedIn) {
        return <ProtectedRoute />;
    }

    return children;
};

Auth.defaultProps = {
    isProtected: false,
};

export default Auth;
