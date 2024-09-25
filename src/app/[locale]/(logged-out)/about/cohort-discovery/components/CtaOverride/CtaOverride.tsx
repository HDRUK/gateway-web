"use client";

import { useState } from "react";
import { Box } from "@mui/material";
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
        console.log(datasetCsv);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Button
                sx={{ mt: 3 }}
                onClick={handleCtaClick}
                data-testid={DATA_TEST_ID}
                color="greyCustom">
                {ctaLink?.title}
            </Button>

            <Button
                sx={{ mt: 3, ml: 3 }}
                onClick={handleVisit}
                color="greyCustom">
                Visit Cohort Discovery
            </Button>
        </Box>
    );
};

export default CtaOverride;
