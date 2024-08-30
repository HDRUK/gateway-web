import { Box } from "@mui/material";

export default async function LoggedOutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box component="section" sx={{ flexGrow: 1 }}>
            {children}
        </Box>
    );
}
