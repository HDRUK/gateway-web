"use client";

import { ReactElement, useState } from "react";
import { CircularProgress, Stack, SxProps, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import useModal from "@/hooks/useModal";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { revalidateCacheAction } from "@/app/actions/revalidateCacheAction";
import { useFeatures } from "@/providers/FeatureProvider";
import Button from "../Button";
import ConditionalWrapper from "../ConditionalWrapper";

const tooltipWrapper = (tooltip: string) => (children: ReactElement) =>
    (
        <Tooltip title={tooltip} describeChild placement="bottom">
            <Box sx={{ p: 0, m: 0, textAlign: "center", width: "100%" }}>
                {children}
            </Box>
        </Tooltip>
    );

const hiddenStatuses = ["APPROVED", "REJECTED", "BANNED", "SUSPENDED"];

const IndicateNhseSdeAccessButton = ({
    sx,
    action,
    refetchCohort,
}: {
    sx?: SxProps;
    action?: () => void;
    refetchCohort?: () => void;
}) => {
    const t = useTranslations("components.IndicateNhseSdeAccessButton");
    const { showModal } = useModal();
    const { isLoggedIn, user, isLoading: isLoadingAuth } = useAuth();
    const { isNhsSdeApplicationsEnabled } = useFeatures();
    const { nhseSdeRequestStatus, isLoading } = useCohortStatus(user?.id, {
        redirect: true,
    });

    const [hasClickedButton, setHasClickedButton] = useState(false);

    const submitRequest = usePost(
        `${apis.cohortRequestsV1Url}/user/${user?.id}/indicate_nhse_access`,
        {
            successNotificationsOn: false,
        }
    );

    const onClick = async () => {
        if (action) {
            return action();
        }

        setHasClickedButton(true); // move to modal action

        showModal({
            content: (
                <Stack sx={{ gap: 2, textAlign: "center" }}>
                    <Typography
                        variant="h2"
                        sx={{ mt: 2, mb: 1 }}
                        color="secondary">
                        {t("successTitle")}
                    </Typography>
                    <Typography>{t("successInfo")}</Typography>
                </Stack>
            ),
            showConfirm: false,
        });

        const result = await submitRequest({});
        if (result) {
            revalidateCacheAction(`cohort-user-${user?.id}`);
            refetchCohort && refetchCohort();
        }
    };
    const approvalPending =
        hasClickedButton || nhseSdeRequestStatus === "APPROVAL REQUESTED";
    const isDisabled =
        !isLoggedIn ||
        approvalPending ||
        hasClickedButton ||
        isLoading ||
        isLoadingAuth ||
        !!(
            nhseSdeRequestStatus &&
            hiddenStatuses.includes(nhseSdeRequestStatus)
        );

    const wrapper = !isLoggedIn
        ? tooltipWrapper(t("disabledTooltip"))
        : approvalPending
        ? tooltipWrapper(t("pendingTooltip"))
        : tooltipWrapper("");

    if (isNhsSdeApplicationsEnabled) {
        return (
            <ConditionalWrapper requiresWrapper={isDisabled} wrapper={wrapper}>
                <span style={{ width: "100%" }}>
                    <Button
                        sx={{ ...sx }}
                        variant="outlined"
                        color="secondary"
                        disabled={isDisabled}
                        onClick={() => user?.id && onClick()}>
                        {isLoading || isLoadingAuth ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            t("label")
                        )}
                    </Button>
                </span>
            </ConditionalWrapper>
        );
    }

    return null;
};

export default IndicateNhseSdeAccessButton;
