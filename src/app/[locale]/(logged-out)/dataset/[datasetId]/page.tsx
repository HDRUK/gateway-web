import Box from "@/components/Box";
import Typography from "@/components/Typography";
import ActionBar from "./components/ActionBar";
import DatasetContent from "./components/DatasetContent";
import DatasetStats from "./components/DatasetStats";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Dataset",
    description: "",
};

export default async function DatasetItemPage({
    params,
}: {
    params: { datasetId: string };
}) {
    const { datasetId } = params;
    console.log(datasetId);

    return (
        <>
            <ActionBar />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ p: 0, gap: 2 }}>
                    <Typography variant="h2" sx={{ pt: 0.5, pb: 0.5 }}>
                        Dataset Name
                    </Typography>
                    <DatasetStats />
                </Box>
                <DatasetContent />
            </Box>
        </>
    );
}
