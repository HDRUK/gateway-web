import { SxProps, Theme } from "@mui/material";

export const layoutSx: SxProps<Theme> = {
    columnGap: { xs: 3, md: 1 },
    rowGap: 2,
    alignItems: "start",
    pl: { xs: 0, sm: 2, md: 0 },
    pr: { xs: 0, sm: 2 },
    pb: 2,
    gridTemplateColumns: {
        xs: "minmax(0, 1fr)",
        sm: "minmax(0, 1fr) minmax(0, 2fr)",
        md: "minmax(0, 3fr) minmax(0, 8fr) minmax(0, 4fr)",
    },
    gridTemplateAreas: {
        xs: `"back" "actions" "nav" "title" "sources" "stats" "mindmap" "content" "aside"`,
        sm: `"left title" "left sources" "left stats" "left mindmap" "left content" "left aside"`,
        md: `"nav back back" "nav title title" "nav stats stats" "nav main sources" "nav main actions" "nav main aside"`,
    },
    gridTemplateRows: {
        sm: "repeat(5, auto) 1fr",
        md: "repeat(5, auto) 1fr",
    },
};

export const areaSx = (area: string): SxProps<Theme> => ({
    gridArea: area,
    p: 0,
    px: { xs: 2, sm: 0 },
    pl: { md: area === "back" ? 0 : 2 },
    minWidth: 0,
});

export const backBarSx: SxProps = {
    clipPath: "inset(0 0 -100% 0)",
};

export const titleSx: SxProps<Theme> = {
    gridArea: "title",
    p: 0,
    px: { xs: 2, sm: 0 },
    pl: { md: 2 },
    pt: { sm: 2, md: 0 },
    minWidth: 0,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: 1,
    "&& > *": { mb: 0 },
};

export const leftColumnSx: SxProps<Theme> = {
    display: { xs: "contents", sm: "flex", md: "contents" },
    flexDirection: "column",
    gap: 2,
    gridArea: { sm: "left" },
    alignSelf: "stretch",
    p: 0,
    minWidth: 0,
};

export const navSx: SxProps<Theme> = {
    gridArea: "nav",
    p: { xs: 0, sm: 2 },
    alignSelf: { md: "start" },
};

export const mainColumnSx: SxProps<Theme> = {
    display: { xs: "contents", md: "flex" },
    flexDirection: "column",
    gap: 2,
    gridArea: { md: "main" },
    p: 0,
    minWidth: 0,
};
