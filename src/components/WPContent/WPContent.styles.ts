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
    });
