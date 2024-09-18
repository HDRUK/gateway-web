"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CtaLink } from "@/interfaces/Cms";
import Button from "@/components/Button";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { COHORT_DISCOVERY_URL } from "@/consts/application";
import { getPermissions } from "@/utils/permissions";

export const DATA_TEST_ID = "cta-override-button";
const COHORT_DISCOVERY_PERMISSION = "GENERAL_ACCESS";

const CtaOverride = ({ ctaLink }: { ctaLink: CtaLink }) => {
    const { showDialog } = useDialog();
    const { push } = useRouter();
    const { isLoggedIn, user } = useAuth();
    const permissions = getPermissions(user?.roles);

    const [isClicked, setIsClicked] = useState(false);

    const handleCtaClick = () => {
        if (permissions[COHORT_DISCOVERY_PERMISSION]) {
            push(COHORT_DISCOVERY_URL);
        } else if (isLoggedIn) {
            push(ctaLink.url);
        } else {
            showDialog(ProvidersDialog, { isProvidersDialog: true });
        }
    };

    const { data: datasetCsv } = useGet(`${apis.cohortRequestsV1Url}/access`, {
        shouldFetch: isClicked,
    });

    const handleVisit = async () => {
        setIsClicked(true);
        datasetCsv;
    };

    return (
        <>
            <Button
                sx={{ mt: 3 }}
                onClick={handleCtaClick}
                data-testid={DATA_TEST_ID}>
                {ctaLink.title}
            </Button>

            <Button sx={{ mt: 3, ml: 3 }} onClick={handleVisit}>
                Visit Cohort Discovery
            </Button>
        </>
    );
};

export default CtaOverride;
