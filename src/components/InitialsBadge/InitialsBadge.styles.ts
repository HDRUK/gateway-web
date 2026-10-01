import { css } from "@emotion/react";
import { tokens } from "@hdruk/ui/theme";
import theme from "@/config/theme";

export const badge = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: tokens.iconSize.large,
    height: tokens.iconSize.large,
    background: tokens.background.white,
    borderRadius: "50%",
    color: tokens.brand.secondary,
});

export const initials = css({
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.3,
});
