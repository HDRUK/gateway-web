// notistack-extensions.d.ts
import { VariantType } from "notistack";

declare module "notistack" {
    interface VariantOverrides {
        apiError: {
            showDismissButton: boolean;
            title: string;
            message: string;
            errors: { title: string; message: string }[];
        };
        apiWarning: {
            showDismissButton: boolean;
            title: string;
            message: string;
            errors: { title: string; message: string }[];
        };
        apiInfo: {
            showDismissButton: boolean;
            title: string;
            message: string;
            errors: { title: string; message: string }[];
        };
        apiSuccess: {
            showDismissButton: boolean;
            title: string;
            message: string;
        };
    }

    export interface VariantTypeMap {
        apiWarning: VariantType;
        apiError: VariantType;
        apiSuccess: VariantType;
        apiInfo: VariantType;
    }
}
