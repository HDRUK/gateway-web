import { Box } from "@mui/material";

export default async function LoggedInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box
            component="main"
            sx={{ flexGrow: 1, display: "flex", width: "100vw" }}>
            {children}
        </Box>
    );
}
