import { FormHelperText, styled } from "@mui/material";

export const DateFilterWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    flexWrap: "wrap",
    [theme.breakpoints.down("lg")]: {
        flexDirection: "column",
    },
}));

export const DateError = styled(FormHelperText)(({ theme }) => ({
    marginTop: theme.spacing(1),
    fontSize: theme.typography.body1.fontSize,
}));
