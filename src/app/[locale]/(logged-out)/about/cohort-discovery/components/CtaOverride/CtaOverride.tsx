"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CtaLink } from "@/interfaces/Cms";
import { CohortRequest } from "@/interfaces/CohortRequest";
import Button from "@/components/Button";
import Tooltip from "@/components/Tooltip";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";

export const DATA_TEST_ID = "cta-override-button";

interface accessRequestType {
    redirect_url: string;
}

const TRANSLATION_PATH_CTAOVERRIDE = "components.CtaOverride";

const CtaOverride = ({ ctaLink }: { ctaLink: CtaLink }) => {
    const { showDialog } = useDialog();
    const { push } = useRouter();
    const { isLoggedIn, user } = useAuth();
    const [isClicked, setIsClicked] = useState(false);
    const t = useTranslations(TRANSLATION_PATH_CTAOVERRIDE);

    const { data: userData } = useGet<CohortRequest>(
        `${apis.cohortRequestsV1Url}/user/${user?.id}`,
        {
            shouldFetch: !!user?.id,
        }
    );

    const { data: accessData } = useGet<accessRequestType>(
        `${apis.cohortRequestsV1Url}/access`,
        {
            shouldFetch: isClicked && userData?.request_status === "APPROVED",
        }
    );

    useEffect(() => {
        if (isClicked) {
            if (accessData?.redirect_url) {
                push(accessData?.redirect_url);
            } else if (isLoggedIn) {
                push(ctaLink.url);
            } else {
                showDialog(ProvidersDialog, { isProvidersDialog: true });
            }
        }
    }, [accessData, isClicked, isLoggedIn]);

    const isDisabled =
        (isLoggedIn && (userData === undefined || userData === null)) ||
        (isLoggedIn && userData?.request_status !== "APPROVED");
    return (
        <Box sx={{ display: "flex" }}>
            <Tooltip title={isDisabled ? t(`notApproved`) : ""}>
                <span>
                    <Button
                        sx={{ mt: 3 }}
                        onClick={() => setIsClicked(true)}
                        data-testid={DATA_TEST_ID}
                        color="greyCustom"
                        disabled={isDisabled}>
                        {ctaLink?.title}
                    </Button>
                </span>
            </Tooltip>
        </Box>
    );
};

export default CtaOverride;
