import { css } from "@emotion/react";

export const banner = css({
    position: "relative",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

export const content = css({
    position: "absolute",
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    gap: "10px",
    color: "white",
    maxWidth: "550px",
    padding: "0 20px",
});
