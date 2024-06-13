"use client";

import { SnackbarProvider as NotistackProvider } from "notistack";
import { ApiError } from "@/components/CustomNotifications/ApiError";
import { ApiInfo } from "@/components/CustomNotifications/ApiInfo";
import { ApiSuccess } from "@/components/CustomNotifications/ApiSuccess";
import { ApiWarning } from "@/components/CustomNotifications/ApiWarning";

const SnackbarProvider = () => {
    return (
        <NotistackProvider
            Components={{
                apiError: ApiError,
                apiSuccess: ApiSuccess,
                apiWarning: ApiWarning,
                apiInfo: ApiInfo,
            }}
        />
    );
};

export default SnackbarProvider;
