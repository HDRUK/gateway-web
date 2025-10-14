"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";

const CohortRedirectProvider = () => {
    const { user } = useAuth();
    const { requestStatus } = useCohortStatus(user?.id);
    const router = useRouter();
    const params = useSearchParams();
    const redirectUrl = params?.get("redirect_cohort_discovery_upon_signin");

    useEffect(() => {
        if (user && requestStatus === "APPROVED" && redirectUrl) {
            router.push(redirectUrl);
        }
    }, [user, requestStatus, redirectUrl, router]);

    return null;
};

export default CohortRedirectProvider;
