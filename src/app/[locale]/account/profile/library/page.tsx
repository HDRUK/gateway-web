import Box from "@/components/Box";
import Header from "./components/Header";
import LibraryTable from "./components/LibraryTable";
import RightPanel from "./components/RightPanel";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Library",
    description: "",
};

export default function LibraryPage() {
    return (
        <>
            <Header />
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "3fr 1fr",
                    gap: 2,
                }}>
                <Box sx={{ p: 0, m: 0 }}>
                    <LibraryTable />
                </Box>
                <RightPanel />
            </Box>
        </>
    );
}
