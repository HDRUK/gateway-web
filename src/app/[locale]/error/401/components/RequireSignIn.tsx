"use client";

import { useEffect } from "react";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useDialog from "@/hooks/useDialog";

export interface RequireSignInProps {
    redirectPath?: string;
}

const RequireSignIn = ({ redirectPath }: RequireSignInProps) => {
    const { showDialog } = useDialog();

    useEffect(() => {
        showDialog(ProvidersDialog, { isProvidersDialog: true, redirectPath });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default RequireSignIn;
