import { Theme } from "@mui/material/styles";

const BADGE_LOGO_WIDTH = 70;
const BADGE_FULL_WIDTH = 256;

export const recaptchaBadgeOpen = (theme: Theme) => ({
    ".grecaptcha-badge": {
        visibility: "visible",
        zIndex: theme.zIndex.modal + 1,
        left: `${theme.spacing(2)} !important`,
        right: "auto !important",
        bottom: `${theme.spacing(2)} !important`,
        width: `${BADGE_LOGO_WIDTH}px !important`,
        overflow: "hidden !important",
        transition: theme.transitions.create("width"),
        "&:hover": {
            width: `${BADGE_FULL_WIDTH}px !important`,
        },
    },
});
