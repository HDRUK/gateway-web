import { styled } from "@mui/material";
import Button from "@/components/Button";

export const SupportList = styled("ul")(() => ({
    listStyle: "none",
    paddingLeft: 0,
    margin: 0,
}));

export const SupportButton = styled(Button)(() => ({
    height: 40,
    width: 160,
    position: "fixed",
    right: -60,
    bottom: 100,
    transform: "rotate(90deg)",
    borderRadius: 4,
    zIndex: 9999,
}));
