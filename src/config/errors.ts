import { SvgIconComponent } from "@mui/icons-material";

type Error = {
    message: string;
    icon?: SvgIconComponent;
    imageSrc?: string;
    imageAlt?: string;
};

export const errors: { [char: number]: Error } = {
    400: {
        message:
            "We couldn't understand your request, please try again and check that the link is valid. Contact support on the need support overlay if this exists",
        imageAlt: "Bad request",
        imageSrc: "/images/errors/400.png",
    },
    401: {
        message: "You do not have access to this page",
        imageAlt: "Unauthorised",
        imageSrc: "/images/errors/401.png",
    },
    403: {
        message: "Permission denied. You do not have access to this page",
        imageAlt: "Permission denied",
        imageSrc: "/images/errors/403.png",
    },
    404: {
        message:
            "Oops! We tried but couldn’t find the page you were looking for",
        imageAlt: "Permission denied",
        imageSrc: "/images/errors/404.png",
    },
    423: {
        message: "This page is currently locked",
    },
    500: {
        message:
            "Uh oh, our internal server has experienced an error, feel free to message us if the problem persists",
        imageAlt: "internal server error",
        imageSrc: "/images/errors/500.png",
    },
};

export type AllowedErrors = keyof typeof errors;
