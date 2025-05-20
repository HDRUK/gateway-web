import { Box } from "@mui/material";
import Header from "@/components/Header";

export default async function LoggedInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box component="main" sx={{ flexGrow: 1 }}>
            {children}
        </Box>
    );
}
