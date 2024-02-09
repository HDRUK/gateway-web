import { css } from "@emotion/react";
import { Theme } from "@mui/material";

const breakpoints = [640, 1024, 1280];
const mq = breakpoints.map(bp => `@media (min-width: ${bp}px)`);

export const searchBarStyle = {
    formWrapper: css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "135px",
        maxWidth: "1000px",
        width: "100%",
    }),

    form: (theme: Theme) =>
        css({
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(1),
            [mq[0]]: {
                gap: theme.spacing(6),
            },
        }),

    inputWrapper: css({
        width: "100%",
        "& div": { margin: 0 },
    }),

    input: css({
        fontSize: "1.5rem",
        marginBottom: 0,
        "& fieldset": { border: "none" },
        "& input": { padding: 0 },
        [mq[0]]: {
            fontSize: "2rem",
        },
    }),

    explainerText: css({
        fontSize: "1rem",
        marginLeft: "57px",
        [mq[0]]: {
            marginLeft: "97px",
        },
    }),
};
