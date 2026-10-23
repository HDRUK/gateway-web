import { Theme } from "@mui/material";

export const noResults = { textAlign: "center", p: 5, mb: 2 };

export const collectionsHeader = {
    mt: 1,
    mb: 1,
    textDecoration: "underline",
};

export const resultsSection = (theme: Theme, isCollections: boolean) => ({
    p: isCollections ? 0 : `0 ${theme.spacing(2)}`,
});

export const externalNotice = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 2,
};

export const externalLink = {
    display: "flex",
    mt: 2,
};
