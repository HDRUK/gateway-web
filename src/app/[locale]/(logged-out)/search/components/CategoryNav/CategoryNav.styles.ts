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

export const tabRoot = { padding: 0 };

export const mobileNav = {
    borderBottom: `3px solid ${colors.green400}`,
    width: "100%",
};

export const mobileNavButton = {
    backgroundColor: "white",
    fontSize: "15px",
    fontWeight: 600,
    "&:hover": { background: "white" },
};

export const mobileNavItem = { fontSize: "15px" };
