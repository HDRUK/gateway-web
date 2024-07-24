import { Box, BoxProps } from "@mui/material";

export type ListItemActionsProps = BoxProps;

export default function ListItemActions({
    children,
    sx,
}: ListItemActionsProps) {
    return (
        <Box
            sx={{
                pl: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderLeft: "1px solid var(--grayscale-600-faded, #868E96)",
                gap: 2,
                ...sx,
            }}>
            {children}
        </Box>
    );
}
