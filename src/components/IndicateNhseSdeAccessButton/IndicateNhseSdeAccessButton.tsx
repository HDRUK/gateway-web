"use client";

import { ReactElement } from "react";
import { SxProps, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import useAuth from "@/hooks/useAuth";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { useFeatures } from "@/providers/FeatureProvider";
import Button from "../Button";
import ConditionalWrapper from "../ConditionalWrapper";

const tooltipWrapper = (tooltip: string) => (children: ReactElement) =>
    (
        <Tooltip title={tooltip} describeChild placement="bottom">
            {children}
        </Tooltip>
    );

const IndicateNhseSdeAccessButton = ({ sx }: { sx?: SxProps }) => {
    const t = useTranslations("components.IndicateNhseSdeAccessButton");
    const { isNhsSdeApplicationsEnabled } = useFeatures();

    const { isLoggedIn, user } = useAuth();
    const submitRequest = usePost(
        `${apis.cohortRequestsV1Url}/user/${user?.id}/indicate_nhse_access`,
        {
            successNotificationsOn: false,
        }
    );

    const onClick = async () => {
        const result = await submitRequest({ details: "required" });
        if (result) {
            notificationService.apiSuccess(t("success"));
        }
    };

    const isDisabled = !isLoggedIn;

    if (isNhsSdeApplicationsEnabled) {
        return (
            <ConditionalWrapper
                requiresWrapper={isDisabled}
                wrapper={tooltipWrapper(t("disabledTooltip") || "")}>
                <div>
                    <Button
                        sx={{ ...sx }}
                        variant="outlined"
                        color="secondary"
                        disabled={isDisabled}
                        onClick={() => user?.id && onClick()}>
                        {t("label")}
                    </Button>
                </div>
            </ConditionalWrapper>
        );
    }

    return <></>;
};

export default IndicateNhseSdeAccessButton;
