import { useCallback, useMemo } from "react";
import { Button, Stack } from "@mui/material";
import { CtaLink } from "@/interfaces/Cms";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import useModal from "@/hooks/useModal";
import { RouteName } from "@/consts/routeName";
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
    const { ctaLink, color } = props;
    const { isLoggedIn } = useAuth();

    const { isRQuestEnabled, isCohortDiscoveryServiceEnabled } = useFeatures();

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

    const handleClick = useCallback(() => {
        if (isLoggedIn) {
            showModal({
                title: "Choose which Cohort Discovery Service",
                content,
                showConfirm: false,
                showCancel: false,
            });
        } else {
            showDialog(ProvidersDialog, {
                isProvidersDialog: true,
                redirectPath: `/${RouteName.ABOUT}/${RouteName.COHORT_DISCOVERY_REQUEST}`,
            });
        }
    }, [content, isLoggedIn, showDialog, showModal]);

    if (isRQuestEnabled && isCohortDiscoveryServiceEnabled) {
        return (
            <Button
                data-testid={DATA_TEST_ID}
                {...props}
                color={color}
                onClick={handleClick}>
                {ctaLink?.title}
            </Button>
        );
    }
    return content;
};

export default CohortDiscoveryButton;
