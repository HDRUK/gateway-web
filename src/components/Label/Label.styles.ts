import { css } from "@emotion/react";

export const label = ({ theme, required }) =>
    css({
        ...(required && {
            ":after": {
                content: '"*"',
                color: theme.palette.error.main,
            },
        }),
    });
