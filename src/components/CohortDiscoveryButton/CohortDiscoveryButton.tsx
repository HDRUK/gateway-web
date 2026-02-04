import { useCallback, useMemo } from "react";
import { Button, Chip, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { CtaLink } from "@/interfaces/Cms";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import useDialog from "@/hooks/useDialog";
import useModal from "@/hooks/useModal";
import { statusMapping } from "@/consts/cohortDiscovery";
import { RouteName } from "@/consts/routeName";
import { capitalise } from "@/utils/general";
import { useFeatures } from "@/providers/FeatureProvider";
import CohortDiscoveryRQuestButton from "./CohortDiscoveryRQuest";
import CohortDiscoveryServiceButton from "./CohortDiscoveryService";

export const DATA_TEST_ID = "cohort-discovery-button";

export interface CohortDiscoveryButtonProps {
    ctaLink: CtaLink;
    showDatasetExplanatoryTooltip: boolean | null;
    color?: string | null;
    tooltipOverride?: string | null;
    disabledOuter?: boolean;
    clickedAction?: () => void;
    onRedirect?: () => void;
}

const CohortDiscoveryButton = (props: CohortDiscoveryButtonProps) => {
    const { showModal, hideModal } = useModal();
    const { showDialog } = useDialog();
    const { push } = useRouter();
    const { ctaLink, color } = props;
    const { isLoggedIn, user, isLoading: isLoadingAuth } = useAuth();
    const { isRQuestEnabled, isCohortDiscoveryServiceEnabled } = useFeatures();
    const { requestStatus, isLoading } = useCohortStatus(user?.id);

    const content = useMemo(
        () => (
            <Stack
                data-testid={DATA_TEST_ID}
                gap={1}
                justifyContent="center"
                direction={"row"}>
                {isRQuestEnabled && <CohortDiscoveryRQuestButton {...props} />}{" "}
                {isCohortDiscoveryServiceEnabled && (
                    <CohortDiscoveryServiceButton
                        onRedirect={() => {
                            hideModal();
                        }}
                        {...props}
                        color="secondary"
                    />
                )}
            </Stack>
        ),
        [isRQuestEnabled, isCohortDiscoveryServiceEnabled, hideModal, props]
    );

    const nonApprovedContent = useMemo(
        () =>
            requestStatus && (
                <Stack direction={"row"} gap={1}>
                    <Typography>Status: </Typography>
                    <Chip
                        size="small"
                        label={capitalise(requestStatus)}
                        color={statusMapping[requestStatus]}
                        sx={{ color: "white" }}
                    />
                </Stack>
            ),
        [requestStatus]
    );

    const handleClick = useCallback(() => {
        if (isLoggedIn) {
            if (requestStatus) {
                if (requestStatus === "APPROVED") {
                    showModal({
                        title: "Choose which Cohort Discovery Service",
                        content,
                        showConfirm: false,
                        showCancel: false,
                    });
                } else {
                    showModal({
                        title: "Your acccess request is not approved",
                        content: nonApprovedContent,
                        showConfirm: false,
                        showCancel: false,
                    });
                }
            } else {
                push(ctaLink.url);
            }
        } else {
            showDialog(ProvidersDialog, {
                isProvidersDialog: true,
                redirectPath: `/${RouteName.ABOUT}/${RouteName.COHORT_DISCOVERY_REQUEST}`,
            });
        }
    }, [
        nonApprovedContent,
        content,
        isLoggedIn,
        ctaLink.url,
        requestStatus,
        showDialog,
        showModal,
        push,
    ]);

    if (isRQuestEnabled && isCohortDiscoveryServiceEnabled) {
        return (
            <Button
                data-testid={DATA_TEST_ID}
                {...props}
                color={color}
                disabled={isLoading || isLoadingAuth}
                onClick={handleClick}>
                {ctaLink?.title}
            </Button>
        );
    }
    return content;
};

export default CohortDiscoveryButton;
