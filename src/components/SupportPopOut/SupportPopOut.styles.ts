import { styled } from "@mui/material";
import Button from "@/components/Button";
import { colors } from "@/config/theme";

export const SupportList = styled("ul")(() => ({
    listStyle: "none",
    paddingLeft: 0,
}));

export const SupportButton = styled(Button)(() => ({
    height: 40,
    width: 140,
    position: "fixed",
    right: -50,
    color: "black",
    top: 500,
    background: colors.yellow400,
    transform: "rotate(90deg)",
    borderRadius: 4,
    zIndex: 9999,
}));
