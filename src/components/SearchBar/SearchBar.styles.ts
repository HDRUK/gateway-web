import { css } from "@emotion/react";
import { Theme } from "@mui/material";

export const formWrapper = css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "135px",
});

export const form = (theme: Theme) =>
    css({
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(6),
    });

export const inputWrapper = css({
    width: "100%",
    "& div": { margin: 0 },
});

export const input = css({
    fontSize: "2rem",
    marginBottom: 0,
    "& fieldset": { border: "none" },
    "& input": { padding: 0 },
});
