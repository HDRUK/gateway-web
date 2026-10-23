import { tokens } from "@hdruk/ui/theme";
import { Theme } from "@mui/material";

const FILTER_SIDEBAR_WIDTH = 350;

const sidebarTransition = (theme: Theme, open: boolean) => ({
    easing: theme.transitions.easing[open ? "easeOut" : "easeIn"],
    duration:
        theme.transitions.duration[open ? "enteringScreen" : "leavingScreen"],
});

export const mobileDrawerContent = {
    mt: 0,
    pt: 2,
    backgroundColor: tokens.background.primary,
};

export const mobileDrawerClose = {
    position: "absolute",
    right: 8,
    top: 30,
    color: tokens.brand.primary,
};

export const layoutRoot = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
};

export const layoutBody = {
    display: "flex",
    width: "100%",
    position: "relative",
};

export const filterSidebar = {
    display: { xs: "none", sm: "block" },
    width: FILTER_SIDEBAR_WIDTH,
    flexShrink: 0,
    whiteSpace: "nowrap",
    "& .MuiDrawer-paper": {
        width: FILTER_SIDEBAR_WIDTH,
        position: "relative",
        boxSizing: "border-box",
        background: "none",
    },
};

export const filterSidebarPaper = {
    boxShadow: "none",
    border: 0,
};

export const filterSidebarContent = {
    ml: 3,
    mb: 2,
    mt: 1,
};

export const filterSidebarToggle = (theme: Theme, open: boolean) => ({
    display: { xs: "none", sm: "inline-flex" },
    position: "absolute",
    zIndex: theme.zIndex.modal,
    borderRadius: "50%",
    backgroundColor: tokens.background.white,
    width: "48px",
    height: "48px",
    top: 20,
    m: 0,
    left: open ? 290 : 20,
    "&:hover": {
        backgroundColor: tokens.status.grey,
    },
    transition: theme.transitions.create(
        "left",
        sidebarTransition(theme, open)
    ),
});

export const filterSidebarToggleIcon = (open: boolean) => ({
    transform: `scaleX(${open ? 1 : -1})`,
});

export const mainContent = (
    theme: Theme,
    open: boolean,
    isMobile: boolean
) => ({
    flexGrow: 1,
    transition: theme.transitions.create(
        "margin",
        sidebarTransition(theme, open)
    ),
    marginLeft: open || isMobile ? 0 : `-280px`,
    padding: `0 ${theme.spacing(2)}`,
    width: `calc(100% - ${FILTER_SIDEBAR_WIDTH}px)`,
});
