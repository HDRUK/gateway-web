import { styled } from "@mui/material";

export const Wrapper = styled("div")<{ hasComponent: boolean }>(
    ({ hasComponent }) => ({
        display: "flex",
        background: "white",
        padding: 20,
        boxShadow: "1px -1px 3px rgba(0,0,0,.09)",
        marginTop: "5px",
        flexDirection: "column",
        alignItems: "end",
        gap: "10px",
        "@media (min-width: 640px)": {
            alignItems: "center",
            justifyContent: hasComponent ? "space-between" : "end",
            flexDirection: "row",
        },
    })
);

export const ButtonWrapper = styled("div")(() => ({
    display: "inline-flex",
    flexWrap: "wrap",
    gap: "12px",
}));
