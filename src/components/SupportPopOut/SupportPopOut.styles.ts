import { styled } from "@mui/material";
import { Button } from "@hdruk/ui";

export const SupportList = styled("ul")(() => ({
    listStyle: "none",
    paddingLeft: 0,
    margin: 0,
}));

export const SupportButton = styled(Button)(({ theme }) => ({
    height: 40,
    width: 160,
    position: "fixed",
    right: 20,
    bottom: 20,
    borderRadius: 4,
    zIndex: theme.zIndex.speedDial,
}));
