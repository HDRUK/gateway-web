import { styled } from "@mui/material";
import Button from "@/components/Button";

export const ClearButton = styled(Button)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: theme.spacing(1),
}));
