"use client";

import { SxProps } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { useFeatures } from "@/providers/FeatureProvider";
import Button from "../Button";

// SC: NHSE SDEs have requested we disable this functionality until they are ready.
// Given this may need swift re-enabling/disabling in future outside of our
// standard release cycle, I've controlled this with feature flags.
const RequestNhseSdeAccessButton = ({ sx }: { sx?: SxProps }) => {
    const t = useTranslations("components.RequestNhseSdeAccessButton");

    const { isNhsSdeApplicationsEnabled } = useFeatures();

    const { push } = useRouter();
    const { user } = useAuth();
    const submitRequest = usePost(
        `${apis.cohortRequestsV1Url}/user/${user?.id}/request_nhse_access`,
        {
            successNotificationsOn: false,
        }
    );

    const onClick = async () => {
        if (isNhsSdeApplicationsEnabled) {
            await submitRequest({ details: "required" });
        }
    };

    return (
        <Button
            sx={{ ...sx }}
            onClick={() => {
                if (user?.id) {
                    onClick();
                }
                push(
                    isNhsSdeApplicationsEnabled
                        ? "https://digital.nhs.uk/services/secure-data-environment-service/expression-of-interest"
                        : "https://digital.nhs.uk/data-and-information/research-powered-by-data/sde-network"
                );
            }}>
            {isNhsSdeApplicationsEnabled ? t("label") : t("temporaryLabel")}
        </Button>
    );
};

export default RequestNhseSdeAccessButton;
