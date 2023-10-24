import { css } from "@emotion/react";

export const loading = css({
    "::after": {
        display: "inline-block",
        animation: "dotty steps(1,end) 2s infinite",
        content: '""',
    },

    "@keyframes dotty": {
        "0%": { content: '""' },
        "25%": { content: '"."' },
        "50%": { content: '".."' },
        "75%": { content: '"..."' },
        "100%": { content: '""' },
    },
});
