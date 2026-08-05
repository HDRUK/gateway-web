import { styled } from "@mui/material";

export const IFRAME_EMBED_MAX_WIDTH = 950;

export const IFrameWrapper = styled("div")({
    margin: 0,
    position: "relative",
    overflow: "hidden",
    width: "100%",
    paddingTop: "56.25%",
    iframe: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        height: "100%",
    },
});
