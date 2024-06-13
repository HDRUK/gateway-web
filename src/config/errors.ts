import { SvgIconComponent } from "@mui/icons-material";
import { RemoveCircleIcon } from "@/consts/icons";

type Error = {
    statusMessage: string;
    message: string;
    icon?: SvgIconComponent;
};

export const errors: { [char: number]: Error } = {
    400: {
        statusMessage: "Page not found",
        message: "This page does not exist.",
        icon: RemoveCircleIcon,
    },
    401: {
        statusMessage: "Unauthorised",
        message: "You are not authorised to access this page.",
        icon: RemoveCircleIcon,
    },
    403: {
        statusMessage: "Forbidden",
        message: "You are forbidden to access this page.",
        icon: RemoveCircleIcon,
    },
    423: {
        statusMessage: "Locked",
        message: "This page is currently locked.",
        icon: RemoveCircleIcon,
    },
};

export type AllowedErrors = keyof typeof errors;
