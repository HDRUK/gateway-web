"use client";

import { styled } from "@mui/material";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import {
    ChecklistTickIcon as tickIcon,
    ChecklistCrossIcon as crossIcon,
    ChecklistWarningIcon as warningIcon,
} from "@/consts/customIcons";

const MARKER_SIZE = 40;
const MARKER_RAISE = 8;
const INLINE_ICON_SIZE = "1.1em";
const INLINE_ICON_OFFSET = "0.15em";

const iconBackground = (icon: string) => ({
    content: "''",
    backgroundImage: icon,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
});

export const StepsList = styled("ol")({
    listStyle: "none",
    margin: 0,
    padding: 0,
});

export const StepMarker = styled("div")(({ theme }) => ({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
    width: MARKER_SIZE,
    "&::after": {
        content: "''",
        position: "absolute",
        top: MARKER_SIZE - MARKER_RAISE,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: theme.spacing(0.25),
        background: colors.grey400,
    },
}));

export const StepCircle = styled("span")(({ theme }) => ({
    position: "relative",
    zIndex: 1,
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `${theme.spacing(0.25)} solid ${colors.grey400}`,
    background: colors.grey200,
    color: colors.grey800,
    fontWeight: 600,
    marginTop: -MARKER_RAISE,
}));

export const StepMarkerIcon = styled("span")(({ theme }) => ({
    position: "relative",
    zIndex: 1,
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.palette.common.white,
    color: colors.grey800,
    marginTop: -(MARKER_RAISE + 2),
    "& svg": {
        fontSize: theme.spacing(3.75),
    },
}));

export const StepContent = styled("div")(({ theme }) => ({
    flex: 1,
    minWidth: 0,
    paddingBottom: theme.spacing(4),

    "& ul.checklist": {
        listStyle: "none",
        paddingLeft: 0,
        margin: `${theme.spacing(1)} 0`,
    },
    "& ul.checklist li": {
        position: "relative",
        paddingLeft: theme.spacing(3.5),
        marginBottom: theme.spacing(0.75),
        "&::before": {
            ...iconBackground(tickIcon),
            position: "absolute",
            left: 0,
            top: INLINE_ICON_OFFSET,
            width: INLINE_ICON_SIZE,
            height: INLINE_ICON_SIZE,
        },
    },
    "& ul.checklist.cross li::before, & ul.checklist li.cross::before": {
        backgroundImage: crossIcon,
    },
    "& .warning": {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
        color: colors.red700,
        "&::before": {
            ...iconBackground(warningIcon),
            flexShrink: 0,
            width: theme.spacing(2.5),
            height: theme.spacing(2.5),
        },
    },
}));

export const StepRow = styled("li")(({ theme }) => ({
    display: "flex",
    alignItems: "stretch",
    gap: theme.spacing(2),
    [`&:last-of-type ${StepMarker}::after`]: {
        display: "none",
    },
    [`&:last-of-type ${StepContent}`]: {
        paddingBottom: 0,
    },
}));

export const StepTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
    lineHeight: 1.3,
}));
