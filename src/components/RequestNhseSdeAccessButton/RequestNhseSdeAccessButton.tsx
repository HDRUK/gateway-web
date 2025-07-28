"use client";

import { SxProps } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import Button from "../Button";

const RequestNhseSdeAccessButton = ({ sx }: { sx?: SxProps }) => {
    const t = useTranslations("components.RequestNhseSdeAccessButton");

    const { push } = useRouter();
    const { user } = useAuth();
    const submitRequest = usePost(
        `${apis.cohortRequestsV1Url}/user/${user?.id}/request_nhse_access`,
        {
            successNotificationsOn: false,
        }
    );

    const onClick = async () => {
        await submitRequest({ details: "required" });
    };

    return (
        <Button
            sx={{ ...sx }}
            onClick={() => {
                user?.id && onClick();
                push(
                    "https://digital.nhs.uk/services/secure-data-environment-service/expression-of-interest"
                );
            }}>
            {t("label")}
        </Button>
    );
};

export default RequestNhseSdeAccessButton;
