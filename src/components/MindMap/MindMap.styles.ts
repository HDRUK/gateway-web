import { tokens } from "@hdruk/ui/theme";
import { styled } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { Handle } from "@xyflow/react";

export const HiddenText = styled("span")(visuallyHidden);

export const HiddenHandle = styled(Handle)({
    minWidth: 0,
    minHeight: 0,
    width: 0,
    height: 0,
    border: 0,
});

export const NodeBox = styled("div")(({ theme }) => ({
    position: "relative",
    "& a, & button": {
        position: "static",
        "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
        },
        "&:focus-visible": {
            outline: "none",
        },
        "&:focus-visible::after": {
            outline: `${tokens.stroke.thick}px solid ${theme.palette.status.keyboardFocus}`,
            outlineOffset: tokens.stroke.medium,
        },
    },
    "& > a": {
        gap: theme.spacing(0.75),
    },
    "& .MuiButton-root": {
        minHeight: 0,
        justifyContent: "flex-start",
        textAlign: "left",
        "&:hover, &.Mui-focusVisible": {
            backgroundColor: "transparent",
        },
    },
}));
