import { Box } from "@mui/material";
import Header from "@/components/Header";

export default async function LoggedInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <Box
                component="main"
                sx={{ flexGrow: 1, display: "flex", width: "100vw" }}>
                {children}
            </Box>
        </>
    );
}
