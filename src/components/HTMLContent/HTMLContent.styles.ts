import { css } from "@emotion/react";

export const content = ({ theme }) =>
    css({
        h5: {
            fontSize: 18,
        },
        a: {
            color: theme.palette.secondary.main,
            ":hover": {
                textDecoration: "none",
            },
        },
        ".wp-has-aspect-ratio": {
            margin: 0,
            position: "relative",
            overflow: "hidden",
            width: "100%",
            paddingTop: "56.25%",
        },
        ".wp-has-aspect-ratio iframe": {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: "100%",
            height: "100%",
        },
    });
