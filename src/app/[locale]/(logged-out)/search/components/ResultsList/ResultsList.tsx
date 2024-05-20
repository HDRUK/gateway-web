import { type ReactNode } from "react";
import { List } from "@mui/material";
import BoxContainer from "@/components/BoxContainer";

export interface ResultsListProps {
    children: ReactNode;
    variant?: "list" | "tiled";
}

export default function ResultsList({
    variant = "list",
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
                    mobile: "repeat(1, 1fr)",
                    desktop: "repeat(3, 1fr)",
                },
                gap: 2,
                mb: 2,
            }}>
            {children}
        </BoxContainer>
    );
}
