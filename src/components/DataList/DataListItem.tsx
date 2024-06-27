import { ReactNode } from "react";
import { Box } from "@mui/material";

interface DataListItemProps {
    primary: ReactNode;
    secondary: ReactNode;
}

export default function DataListItem({
    primary,
    secondary,
}: DataListItemProps) {
    return (
        <Box sx={{ display: "flex" }}>
            <Box sx={{ width: "200px" }}>{primary}</Box>
            <Box sx={{ justifyContent: "flex-end" }}>{secondary}</Box>
        </Box>
    );
}
