import { ReactNode } from "react";
import { CardContent, Paper } from "@mui/material";

export interface AccordionCardProps {
    children: ReactNode;
}

export default function AccordionCard({ children }: AccordionCardProps) {
    return (
        <Paper elevation={0}>
            <CardContent
                sx={{
                    gap: 2,
                    flexDirection: "column",
                    display: "flex",
                }}>
                {children}
            </CardContent>
        </Paper>
    );
}
