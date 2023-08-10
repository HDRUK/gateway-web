import { colors } from "@/config/theme";
import { css } from "@emotion/react";

export const typeAheadDropDown = (theme, color) =>
    css({

        "ul:before": {
        },
        "ul": {
            position: "relative",
            listStyleType: "none",
            textAlign: "left",
            margin: 0,
            padding: 0,
            boxShadow: "8px 7px 18px -3px rgba(0,0,0,0.75)",
        },
        "li": {
            padding: "10px 5px",
            cursor: "pointer",
        },
        "li:hover": {
            background: theme.palette[color].main,
            color: colors.white,
        }
    });