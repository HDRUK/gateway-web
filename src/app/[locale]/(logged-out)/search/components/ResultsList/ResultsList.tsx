import { type ReactNode } from "react";
import { List } from "@mui/material";
import BoxContainer from "@/components/BoxContainer";

export interface ResultsListProps {
    children: ReactNode;
    variant?: "list" | "tiled";
    minTileWidth?: number;
    maxDesktopColumns?: number;
}

export default function ResultsList({
    variant = "list",
    minTileWidth = 250,
    maxDesktopColumns,
    children,
}: ResultsListProps) {
    return variant === "list" ? (
        <List
            sx={{
                width: "100%",
                bgcolor: "background.paper",
                mb: 2,
                pb: 2,
            }}>
            {children}
        </List>
    ) : (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    mobile: "repeat(1, minmax(0, 1fr))",
                    tablet: `repeat(auto-fit, minmax(${minTileWidth}px, 1fr))`,
                    ...(maxDesktopColumns && {
                        desktop: `repeat(${maxDesktopColumns}, minmax(0, 1fr))`,
                    }),
                },
                gap: 2,
                mb: 2,
            }}>
            {children}
        </BoxContainer>
    );
}
