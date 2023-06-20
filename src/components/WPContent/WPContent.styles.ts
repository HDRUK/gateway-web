import { css } from "@emotion/react";

export const content = ({ theme }) =>
    css({
        h5: {
            fontSize: 24,
        },
        a: {
            color: theme.palette.secondary.main,
            ":hover": {
                textDecoration: "none",
            },
        },
    });
