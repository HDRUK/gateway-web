import { useEffect, useMemo, useState } from "react";
import { CircularProgress, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CtaLink } from "@/interfaces/Cms";
import Button from "@/components/Button";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import useDialog from "@/hooks/useDialog";
import { RouteName } from "@/consts/routeName";

interface CohortDiscoveryButtonProps {
    ctaLink: CtaLink;
    showDatasetExplanatoryTooltip: boolean | null;
    color?: string | null;
    tooltipOverride?: string | null;
    disabledOuter?: boolean;
    clickedAction?: () => void;
}

export const DATA_TEST_ID = "cohort-discovery-button";

const TRANSLATION_PATH_CTAOVERRIDE = "components.CohortDiscoveryButton";

const CohortDiscoveryRQuestButton = ({
    ctaLink,
    showDatasetExplanatoryTooltip = false,
    color = undefined,
    tooltipOverride = "",
    disabledOuter = false,
    clickedAction,
    ...restProps
}: CohortDiscoveryButtonProps) => {
    const { showDialog } = useDialog();
    const { push } = useRouter();
    const { isLoggedIn, user, isLoading: isLoadingAuth } = useAuth();
    const { requestStatus, redirectUrl } = useCohortStatus(user?.id, {
        redirect: true,
    });

    const [isClicked, setIsClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const t = useTranslations(TRANSLATION_PATH_CTAOVERRIDE);

    const openAthensInvalid = useMemo(
        () =>
            isLoggedIn &&
            user?.provider === "open-athens" &&
            !user?.secondary_email,
        [isLoggedIn, user]
    );

    useEffect(() => {
        if (isClicked) {
            setIsClicked(false);
            setIsLoading(true);
            if (clickedAction) {
                clickedAction();
            }
            if (redirectUrl) {
                push(redirectUrl);
            } else if (isLoggedIn) {
                // check that if the user is using OpenAthens, that they have provided a secondary email,
                // and send them to set it if not
                if (openAthensInvalid) {
                    push(`/${RouteName.ACCOUNT}/${RouteName.PROFILE}`);
                } else {
                    push(ctaLink.url);
                }
            } else {
                showDialog(ProvidersDialog, {
                    isProvidersDialog: true,
                    redirectPath: `/${RouteName.ABOUT}/${RouteName.COHORT_DISCOVERY_REQUEST}`,
                });
                setIsLoading(false);
            }
        }
    }, [redirectUrl, isClicked, isLoggedIn, clickedAction]);

    const isDisabled =
        isLoggedIn && requestStatus
            ? !["APPROVED", "REJECTED", "EXPIRED"].includes(requestStatus)
            : false;

    const isApproved =
        isLoggedIn && requestStatus && requestStatus === "APPROVED";

    return (
        <Tooltip
            title={
                tooltipOverride ||
                (isDisabled
                    ? t(`notApproved`)
                    : openAthensInvalid
                    ? t("setSecondaryEmail")
                    : showDatasetExplanatoryTooltip && isApproved
                    ? t("explanatoryTooltip")
                    : "")
            }>
            <span>
                <Button
                    onClick={() => setIsClicked(true)}
                    data-testid={DATA_TEST_ID}
                    color={color}
                    disabled={disabledOuter || isDisabled}
                    {...restProps}>
                    {isLoading || isLoadingAuth ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        ctaLink?.title
                    )}
                </Button>
            </span>
        </Tooltip>
    );
};

export default CohortDiscoveryRQuestButton;
