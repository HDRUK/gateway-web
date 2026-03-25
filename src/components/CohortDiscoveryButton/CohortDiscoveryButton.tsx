"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
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
import useLogout from "@/hooks/useLogout";
import useModal from "@/hooks/useModal";
import { statusMapping } from "@/consts/cohortDiscovery";
import { RouteName } from "@/consts/routeName";
import { capitalise } from "@/utils/general";
import { useFeatures } from "@/providers/FeatureProvider";
import Box from "../Box";
import CohortDiscoveryAccessButton from "./CohortDiscoveryAccessButton";

export const DATA_TEST_ID = "cohort-discovery-button";
const TRANSLATION_PATH = "components.CohortDiscoveryButton";

export interface CohortDiscoveryButtonProps {
    showDatasetExplanatoryTooltip?: boolean | null;
    color?: ButtonProps["color"];
    wrapperSx?: SxProps;
    tooltipOverride?: string | null;
    hrefOverride?: string;
    disabledOuter?: boolean;
    clickedAction?: () => void;
    onRedirect?: () => void;
    autoOpen?: boolean;
}

const CohortDiscoveryButton = ({
    showDatasetExplanatoryTooltip,
    color = "primary",
    wrapperSx,
    tooltipOverride,
    hrefOverride,
    disabledOuter = false,
    clickedAction,
    onRedirect,
    autoOpen = false,
    ...restProps
}: CohortDiscoveryButtonProps) => {
    const { showModal } = useModal();
    const { showDialog } = useDialog();
    const { push } = useRouter();
    const logout = useLogout();
    const t = useTranslations(TRANSLATION_PATH);
    const hasAutoOpenedRef = useRef(false);

    const { isRQuestEnabled, isCohortDiscoveryServiceEnabled } = useFeatures();
    const { isLoggedIn, user, claims, isLoading: isLoadingAuth } = useAuth();

    const {
        requestStatus,
        requestExpiry,
        isLoading: isLoadingStatus,
        hasFetched: hasFetchedStatus,
    } = useCohortStatus(user?.id);

    const {
        redirectUrl: rQuestRedirectUrl,
        isLoading: isLoadingRQuestRedirect,
        hasFetched: hasFetchedCdsRedirect,
    } = useCohortStatus(user?.id, {
        redirect: true,
    });

    const {
        redirectUrl: cdsRedirectUrl,
        isLoading: isLoadingCdsRedirect,
        hasFetched: hasFetchedRQuestRedirect,
    } = useCohortStatus(user?.id, {
        redirect: true,
        useRQuest: false,
    });

    const isLoading =
        isLoadingAuth ||
        isLoadingStatus ||
        isLoadingRQuestRedirect ||
        isLoadingCdsRedirect;

    const isReady =
        !isLoadingAuth &&
        hasFetchedStatus &&
        hasFetchedCdsRedirect &&
        hasFetchedRQuestRedirect;

    const isApproved = isLoggedIn && requestStatus === "APPROVED";

    const hasClaimsMismatch =
        isApproved &&
        !claims?.cohort_discovery_roles?.includes("GENERAL_ACCESS");

    const openAthensInvalid = Boolean(
        isLoggedIn && user?.provider === "open-athens" && !user?.secondary_email
    );

    const isPendingApproval = Boolean(
        isLoggedIn &&
            requestStatus &&
            !["APPROVED", "REJECTED", "EXPIRED"].includes(requestStatus)
    );

    const isDisabled = disabledOuter || openAthensInvalid || isPendingApproval;

    const handleRequestAccess = useCallback(() => {
        push(
            `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_REGISTER}`
        );
    }, [push]);

    const openRedirect = useCallback(
        (redirectUrl?: string) => {
            if (!redirectUrl) return;

            clickedAction?.();

            if (redirectUrl.startsWith("/")) {
                push(redirectUrl);
            } else {
                window.open(redirectUrl, "_blank", "noopener,noreferrer");
            }

            onRedirect?.();
        },
        [clickedAction, onRedirect, push]
    );

    const handleOpenRQuest = useCallback(() => {
        if (openAthensInvalid) {
            push(`/${RouteName.ACCOUNT}/${RouteName.PROFILE}`);
            return;
        }

        if (rQuestRedirectUrl) {
            openRedirect(rQuestRedirectUrl);
            return;
        }

        handleRequestAccess();
    }, [
        openAthensInvalid,
        push,
        rQuestRedirectUrl,
        openRedirect,
        handleRequestAccess,
    ]);

    const handleOpenCds = useCallback(() => {
        if (!cdsRedirectUrl) return;
        openRedirect(cdsRedirectUrl);
    }, [cdsRedirectUrl, openRedirect]);

    const nonApprovedContent = useMemo(() => {
        if (!requestStatus) return null;

        return (
            <Stack direction="column" gap={1}>
                <Stack direction="row" gap={1}>
                    <Typography>{t("statusLabel")}</Typography>
                    <Chip
                        size="small"
                        label={capitalise(requestStatus)}
                        color={statusMapping[requestStatus]}
                        sx={{ color: "white" }}
                    />
                </Stack>

                {requestExpiry && (
                    <Stack direction="row" gap={1}>
                        <Typography>{t("expiresAtLabel")}</Typography>
                        <Chip
                            size="small"
                            label={requestExpiry}
                            color="default"
                            sx={{ color: "text.main" }}
                        />
                    </Stack>
                )}
            </Stack>
        );
    }, [t, requestStatus, requestExpiry]);

    const chooserContent = useMemo(
        () => (
            <Stack
                data-testid={DATA_TEST_ID}
                gap={1}
                justifyContent="center"
                direction="row">
                {isRQuestEnabled && (
                    <CohortDiscoveryAccessButton
                        color={color}
                        disabledOuter={!rQuestRedirectUrl}
                        onClick={handleOpenRQuest}
                        tooltip={tooltipOverride || t("rquest.tooltip")}
                        label={t("rquest.label")}
                        testId="request-cohort-discovery-button"
                        {...restProps}
                    />
                )}

                {isCohortDiscoveryServiceEnabled && (
                    <CohortDiscoveryAccessButton
                        color="secondary"
                        disabledOuter={!cdsRedirectUrl}
                        onClick={handleOpenCds}
                        tooltip={t("cds.tooltip")}
                        label={t("cds.label")}
                        testId="new-cohort-discovery-button"
                        forceWhiteText
                        {...restProps}
                    />
                )}
            </Stack>
        ),
        [
            isRQuestEnabled,
            isCohortDiscoveryServiceEnabled,
            color,
            rQuestRedirectUrl,
            cdsRedirectUrl,
            handleOpenRQuest,
            handleOpenCds,
            tooltipOverride,
            restProps,
            t,
        ]
    );

    const handleClick = useCallback(() => {
        if (!isLoggedIn) {
            showDialog(ProvidersDialog, {
                isProvidersDialog: true,
                redirectPath:
                    hrefOverride ||
                    `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_REQUEST}?open=true`,
            });
            return;
        }

        if (!requestStatus) {
            handleRequestAccess();
            return;
        }

        if (requestStatus !== "APPROVED") {
            showModal({
                title: t("modals.notApproved.title"),
                content: nonApprovedContent,
                showConfirm: true,
                showCancel: true,
                confirmText: t("modals.notApproved.confirmText"),
                onSuccess: handleRequestAccess,
            });
            return;
        }

        if (hasClaimsMismatch) {
            showModal({
                title: t("modals.claimsMismatch.title"),
                content: (
                    <Typography>
                        {t("modals.claimsMismatch.content")}
                    </Typography>
                ),
                confirmText: t("modals.claimsMismatch.confirmText"),
                showConfirm: true,
                showCancel: true,
                onSuccess: logout,
            });
            return;
        }

        if (isRQuestEnabled && isCohortDiscoveryServiceEnabled) {
            showModal({
                title: t("modals.chooser.title"),
                content: chooserContent,
                showConfirm: false,
                showCancel: false,
            });
            return;
        }

        if (isRQuestEnabled) {
            handleOpenRQuest();
            return;
        }

        if (isCohortDiscoveryServiceEnabled) {
            handleOpenCds();
        }
    }, [
        t,
        isLoggedIn,
        hrefOverride,
        requestStatus,
        nonApprovedContent,
        handleRequestAccess,
        hasClaimsMismatch,
        logout,
        isRQuestEnabled,
        isCohortDiscoveryServiceEnabled,
        chooserContent,
        handleOpenRQuest,
        handleOpenCds,
        showDialog,
        showModal,
    ]);

    useEffect(() => {
        if (!autoOpen) return;
        if (hasAutoOpenedRef.current) return;
        if (!isReady) return;

        hasAutoOpenedRef.current = true;
        handleClick();
    }, [autoOpen, cdsRedirectUrl, requestStatus, isReady, handleClick]);

    return (
        <Tooltip
            title={
                tooltipOverride ||
                (openAthensInvalid
                    ? t("setSecondaryEmail")
                    : isPendingApproval
                    ? t("notApproved")
                    : showDatasetExplanatoryTooltip && isApproved
                    ? t("explanatoryTooltip")
                    : "")
            }>
            <Box component="span" sx={{ p: 0, ...wrapperSx }}>
                <Button
                    onClick={handleClick}
                    data-testid={DATA_TEST_ID}
                    color={color}
                    disabled={isLoading || isDisabled}
                    sx={{ width: "100%" }}
                    {...restProps}>
                    {isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        t("buttonText")
                    )}
                </Button>
            </Box>
        </Tooltip>
    );
};

export default CohortDiscoveryButton;
