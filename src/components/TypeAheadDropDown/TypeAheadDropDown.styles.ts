import { colors } from "@/config/theme";
import { css } from "@emotion/react";
import { Palette, PaletteColor, Theme } from "@mui/material/styles";

export const typeAheadDropDown = (theme: Theme, color: string) => {
    return css({
        "ul:before": {},
        ul: {
            position: "relative",
            listStyleType: "none",
            textAlign: "left",
            margin: 0,
            padding: 0,
            boxShadow: "8px 7px 18px -3px rgba(0,0,0,0.75)",
        },
        li: {
            padding: "10px 5px",
            cursor: "pointer",
        },
        "li:hover": {
            background: (theme.palette[color as keyof Palette] as PaletteColor)
                .main,
            color: colors.white,
        },
    });
};
