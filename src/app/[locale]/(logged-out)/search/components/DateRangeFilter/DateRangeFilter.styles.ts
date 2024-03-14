import { FormHelperText, styled } from "@mui/material";

export const DateFilterWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),

    [theme.breakpoints.down("desktop")]: {
        flexDirection: "column",
    },
}));

export const DateError = styled(FormHelperText)(({ theme }) => ({
    marginTop: theme.spacing(1),
    fontSize: theme.typography.body1.fontSize,
}));
