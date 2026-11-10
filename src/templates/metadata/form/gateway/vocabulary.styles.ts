import { tokens } from "@hdruk/ui/theme";
import { styled } from "@mui/material/styles";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";

export const AsidePaper = styled(Paper)(({ theme }) => ({
    flex: "1 1 0%",
    padding: theme.spacing(2),
    margin: theme.spacing(1.25),
    marginLeft: 0,
    marginBottom: 0,
    alignItems: "center",
    wordBreak: "break-word",
}));

export const AsideHint = styled(Typography)(({ theme }) => ({
    color: tokens.text.faded,
    paddingBottom: theme.spacing(2),
}));
