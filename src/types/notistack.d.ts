declare module "notistack" {
    interface VariantOverrides {
        apiError: {
            showDismissButton: boolean;
            title: string;
            message: string;
            errors: { title: string; message: string }[];
        };
    }
}
