import { tokens } from "@hdruk/ui/theme";
import { SxProps, Theme } from "@mui/material";
import { colors } from "@/config/theme";
import { STEP_STATE } from "@/consts/cohortDiscovery";

export type CircleState = (typeof STEP_STATE)[keyof typeof STEP_STATE];

const CIRCLE_SIZE = 36;
const CIRCLE_SIZE_SMALL = 30;
const CIRCLE_FONT_SIZE = 14;
const CIRCLE_FONT_SIZE_SMALL = 12;
const CIRCLE_FONT_WEIGHT = 600;

const circleColors: Record<
    CircleState,
    { bg: string; color: string; border: string }
> = {
    [STEP_STATE.COMPLETE]: {
        bg: tokens.brand.secondary,
        color: tokens.text.primaryWhite,
        border: "none",
    },
    [STEP_STATE.ACTIVE]: {
        bg: tokens.text.primaryBlack,
        color: tokens.text.primaryWhite,
        border: "none",
    },
    [STEP_STATE.LOCKED]: {
        bg: tokens.status.hovered,
        color: colors.grey500,
        border: "none",
    },
    [STEP_STATE.PENDING]: {
        bg: tokens.background.white,
        color: colors.grey500,
        border: `2px solid ${colors.grey400}`,
    },
};

export const getCircleSx = (
    circleState: CircleState,
    small?: boolean
): SxProps<Theme> => ({
    width: small ? CIRCLE_SIZE_SMALL : CIRCLE_SIZE,
    height: small ? CIRCLE_SIZE_SMALL : CIRCLE_SIZE,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: small ? CIRCLE_FONT_SIZE_SMALL : CIRCLE_FONT_SIZE,
    fontWeight: CIRCLE_FONT_WEIGHT,
    lineHeight: 1,
    bgcolor: circleColors[circleState].bg,
    color: circleColors[circleState].color,
    border: circleColors[circleState].border,
});

export const connectorSx: SxProps<Theme> = theme => ({
    flexGrow: 1,
    width: 2,
    bgcolor: tokens.status.grey,
    my: 0.75,
    minHeight: theme.spacing(2.5),
});
