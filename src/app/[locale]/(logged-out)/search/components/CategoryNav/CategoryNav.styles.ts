import { tokens } from "@hdruk/ui/theme";
import { Theme } from "@mui/material";
import { colors } from "@/config/theme";

export const navRoot = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
};

export const tabBox = (scrollable: boolean) => ({
    paddingLeft: !scrollable ? "45px" : "5px",
    paddingRight: !scrollable ? "45px" : "5px",
});

export const tabRoot = { padding: 0, display: { xs: "none", sm: "block" } };

export const mobileNav = {
    display: { xs: "block", sm: "none" },
    borderBottom: `3px solid ${colors.green400}`,
    width: "100%",
};

export const mobileNavButton = {
    width: "100%",
    color: tokens.text.secondaryBlack,
    backgroundColor: tokens.background.white,
    fontSize: "15px",
    fontWeight: 600,
    "&:hover": { backgroundColor: tokens.background.white },
    "& .MuiButton-endIcon": {
        position: "absolute",
        right: (theme: Theme) => theme.spacing(2),
    },
};

export const mobileNavItem = { fontSize: "15px" };
