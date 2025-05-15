import { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CtaLink } from "@/interfaces/Cms";
import { CohortRequest } from "@/interfaces/CohortRequest";
import Button from "@/components/Button";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";

interface accessRequestType {
    redirect_url: string;
}

interface CohortDiscoveryButtonProps {
    ctaLink: CtaLink;
    showDatasetExplanatoryTooltip: boolean | null;
    color?: string | null;
    tooltipOverride?: string | null;
    disabledOuter?: boolean;
}

export const DATA_TEST_ID = "cohort-discovery-button";

const TRANSLATION_PATH_CTAOVERRIDE = "components.CohortDiscoveryButton";

const CohortDiscoveryButton = ({
    ctaLink,
    showDatasetExplanatoryTooltip = false,
    color = undefined,
    tooltipOverride = "",
    disabledOuter = false,
    ...restProps
}: CohortDiscoveryButtonProps) => {
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
        isLoggedIn && userData
            ? !["APPROVED", "REJECTED", "EXPIRED"].includes(
                  userData.request_status
              )
            : false;

    const isApproved =
        isLoggedIn && userData && userData.request_status === "APPROVED";

    return (
        <Tooltip
            title={
                tooltipOverride
                    ? tooltipOverride
                    : isDisabled
                    ? t(`notApproved`)
                    : showDatasetExplanatoryTooltip && isApproved
                    ? t("explanatoryTooltip")
                    : ""
            }>
            <span>
                <Button
                    onClick={() => setIsClicked(true)}
                    data-testid={DATA_TEST_ID}
                    color={color}
                    disabled={disabledOuter || isDisabled}
                    {...restProps}>
                    {ctaLink?.title}
                </Button>
            </span>
        </Tooltip>
    );
};

export default CohortDiscoveryButton;
