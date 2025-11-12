"use client";

import { ReactElement, useState } from "react";
import { CircularProgress, SxProps, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { revalidateCacheAction } from "@/app/actions/revalidateCacheAction";
import { useFeatures } from "@/providers/FeatureProvider";
import Button from "../Button";
import ConditionalWrapper from "../ConditionalWrapper";

const tooltipWrapper = (tooltip: string) => (children: ReactElement) =>
    (
        <Tooltip title={tooltip} describeChild placement="bottom">
            {children}
        </Tooltip>
    );

const hiddenStatuses = ["APPROVED", "REJECTED", "BANNED", "SUSPENDED"];

const IndicateNhseSdeAccessButton = ({ sx }: { sx?: SxProps }) => {
    const t = useTranslations("components.IndicateNhseSdeAccessButton");
    const { isLoggedIn, user, isLoading: isLoadingAuth } = useAuth();
    const { isNhsSdeApplicationsEnabled } = useFeatures();
    const { nhseSdeRequestStatus, isLoading } = useCohortStatus(user?.id, true);

    const [hasClickedButton, setHasClickedButton] = useState(false);

    const submitRequest = usePost(
        `${apis.cohortRequestsV1Url}/user/${user?.id}/indicate_nhse_access`,
        {
            successNotificationsOn: false,
        }
    );

    const onClick = async () => {
        setHasClickedButton(true);
        const result = await submitRequest({});
        if (result) {
            revalidateCacheAction(`cohort-user-${user?.id}`);
            notificationService.apiSuccess(t("success"));
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
                <div>
                    <Button
                        sx={{ ...sx, width: "100%" }}
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
                </div>
            </ConditionalWrapper>
        );
    }

    return null;
};

export default IndicateNhseSdeAccessButton;
