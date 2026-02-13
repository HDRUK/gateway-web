"use client";

import { useCallback, useMemo } from "react";
import {
    ButtonProps,
    Chip,
    CircularProgress,
    Stack,
    SxProps,
    Tooltip,
    Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import useDialog from "@/hooks/useDialog";
import useModal from "@/hooks/useModal";
import { statusMapping } from "@/consts/cohortDiscovery";
import { RouteName } from "@/consts/routeName";
import { capitalise } from "@/utils/general";
import { useFeatures } from "@/providers/FeatureProvider";
import Box from "../Box";
import CohortDiscoveryRQuestButton from "./CohortDiscoveryRQuest";
import CohortDiscoveryServiceButton from "./CohortDiscoveryService";

export const DATA_TEST_ID = "cohort-discovery-button";

const TRANSLATION_PATH_CTAOVERRIDE = "components.CohortDiscoveryButton";

export interface CohortDiscoveryButtonProps {
    showDatasetExplanatoryTooltip?: boolean | null;
    color?: ButtonProps["color"];
    wrapperSx?: SxProps;
    tooltipOverride?: string | null;
    hrefOverride?: string;
    disabledOuter?: boolean;
    clickedAction?: () => void;
    onRedirect?: () => void;
}

const CohortDiscoveryButton = (props: CohortDiscoveryButtonProps) => {
    const { showModal, hideModal } = useModal();
    const { showDialog } = useDialog();
    const { push } = useRouter();
    const { color } = props;
    const { isLoggedIn, user, isLoading: isLoadingAuth } = useAuth();
    const { isRQuestEnabled, isCohortDiscoveryServiceEnabled } = useFeatures();
    const { requestStatus, isLoading } = useCohortStatus(user?.id);

    const t = useTranslations(TRANSLATION_PATH_CTAOVERRIDE);

    const content = useMemo(
        () => (
            <Stack
                data-testid={DATA_TEST_ID}
                gap={1}
                justifyContent="center"
                direction={"row"}>
                {isRQuestEnabled && <CohortDiscoveryRQuestButton {...props} />}
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
            push(
                props.hrefOverride
                    ? props.hrefOverride
                    : `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_REQUEST}`
            );
        }
    }, [
        requestStatus,
        showModal,
        content,
        nonApprovedContent,
        push,
        props.hrefOverride,
    ]);

    const isDisabled =
        isLoggedIn && requestStatus
            ? !["APPROVED", "REJECTED", "EXPIRED"].includes(requestStatus)
            : false;

    const isApproved =
        isLoggedIn && requestStatus && requestStatus === "APPROVED";

    const openAthensInvalid = useMemo(
        () =>
            isLoggedIn &&
            user?.provider === "open-athens" &&
            !user?.secondary_email,
        [isLoggedIn, user]
    );

    if (!isLoggedIn) {
        return (
            <Box component="span" sx={{ p: 0, ...props.wrapperSx }}>
                <Button
                    onClick={() => {
                        showDialog(ProvidersDialog, {
                            isProvidersDialog: true,
                            redirectPath: props.hrefOverride
                                ? props.hrefOverride
                                : `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_REQUEST}`,
                        });
                    }}
                    data-testid={DATA_TEST_ID}
                    color={color}
                    {...props}
                    sx={{ width: "100%" }}>
                    {isLoading || isLoadingAuth ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        t("buttonText")
                    )}
                </Button>
            </Box>
        );
    }

    if (isRQuestEnabled && isCohortDiscoveryServiceEnabled) {
        return (
            <Tooltip
                title={
                    isDisabled
                        ? t(`notApproved`)
                        : openAthensInvalid
                        ? t("setSecondaryEmail")
                        : props.showDatasetExplanatoryTooltip && isApproved
                        ? t("explanatoryTooltip")
                        : ""
                }>
                <Box component="span" sx={{ p: 0, ...props.wrapperSx }}>
                    <Button
                        onClick={handleClick}
                        data-testid={DATA_TEST_ID}
                        color={color}
                        disabled={isLoading || isLoadingAuth || isDisabled}
                        {...props}
                        sx={{ width: "100%" }}>
                        {isLoading || isLoadingAuth ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            t("buttonText")
                        )}
                    </Button>
                </Box>
            </Tooltip>
        );
    }
    return content;
};

export default CohortDiscoveryButton;
