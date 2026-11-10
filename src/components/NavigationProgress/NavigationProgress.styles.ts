import { styled } from "@mui/material/styles";

export const Wrapper = styled("div")(({ theme }) => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.tooltip + 1,
    pointerEvents: "none",
}));
