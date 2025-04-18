import { Box } from "@mui/material";
import Header from "@/components/Header";

export default async function LoggedOutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>
        </>
    );
}
