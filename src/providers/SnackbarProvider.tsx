"use client";

import { SnackbarProvider as NotistackProvider } from "notistack";
import { ApiError } from "@/components/CustomNotifications/ApiError";
import { ApiSuccess } from "@/components/CustomNotifications/ApiSuccess";
import { ApiWarning } from "@/components/CustomNotifications/ApiWarning";
import { ApiInfo } from "@/components/CustomNotifications/ApiInfo";

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
