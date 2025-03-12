import { Box } from "@mui/material";
import ActionBar from "@/components/ActionBar";
import Header from "@/components/Header";

export default async function LoggedInLayout({
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
            <ActionBar />
        </>
    );
}
