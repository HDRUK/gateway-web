import { tokens } from "@hdruk/ui/theme";
import { SxProps, Theme } from "@mui/material";

export const getIndicatorColour = (expiringSoon: boolean) =>
    expiringSoon ? tokens.text.warning : tokens.text.faded;

export const rootSx: SxProps<Theme> = {
    display: "flex",
    alignItems: "center",
    gap: 1,
};

export const noteSx: SxProps<Theme> = {
    color: tokens.text.faded,
};
