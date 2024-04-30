import { Box, Typography } from "@mui/material";
import { cookies } from "next/headers";
import { VersionItem } from "@/interfaces/Dataset";
import { Publication } from "@/interfaces/Publication";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import LayoutDataItemPage from "@/modules/LayoutDataItemPage";
import { getCollection, getDataset } from "@/utils/api";
import { getLatestVersion } from "@/utils/dataset";
import ActionBar from "./components/ActionBar";
import DatasetsContent from "./components/DatasetsContent";
import DatausesContent from "./components/DatausesContent";
import PublicationsContent from "./components/PublicationsContent";
import ToolsContent from "./components/ToolsContent";
import { collectionSections } from "./config";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Collection",
    description: "",
};

export default async function CollectionItemPage({
    params,
}: {
    params: { collectionId: string };
}) {
    const { collectionId } = params;
    const cookieStore = cookies();

    const collection = await getCollection(cookieStore, collectionId);

    const datasets = await Promise.all(
        collection.datasets.map(({ id }) =>
            getDataset(cookieStore, id.toString())
        )
    );

    const datasetsLatestVersions = datasets.map(({ versions }) =>
        getLatestVersion(versions)
    );

    const publications = datasetsLatestVersions
        .reduce((item: Publication[], datasetVersion: VersionItem) => {
            return item.concat(datasetVersion.publications);
        }, [])
        .filter(item => !!item);

    const activeLinkList = collectionSections.map(({ sectionName: label }) => {
        return { label };
    });

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} />}
            body={
                <Box sx={{ px: 6, py: 3 }}>
                    <Box sx={{ mb: 3 }}>
                        <ActionBar />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h3">Description</Typography>
                        <Typography>
                            Lorem ipsum dolor sit amet ad hicio hortus est ipsum
                            dolor sit amet ad hicio hortus est ipsum dolor sit
                            amet ad hicio hortus est ipsum dolor sit amet ad
                            hicio hortus est ipsum dolor sit amet ad hicio
                            hortus est ipsum dolor sit amet ad hicio hortus est
                            ipsum dolor sit amet ad hicio hortus est ipsum dolor
                            sit amet ad hicio hortus est ipsum dolor sit amet ad
                            hicio hortus est ipsum dolor sit amet ad hicio
                            hortus est ipsum dolor sit amet ad hicio hortus est
                            ipsum dolor sit amet ad hicio hortus est ipsum dolor
                            sit amet ad hicio hortus est ipsum dolor sit amet ad
                            hicio hortus est ipsum dolor sit amet ad hicio
                            hortus est ipsum dolor sit amet ad hicio hortus est
                        </Typography>
                    </Box>
                    <Box>
                        <DatasetsContent datasets={datasets} anchorIndex={1} />

                        <ToolsContent
                            tools={collection.tools}
                            anchorIndex={2}
                        />

                        <DatausesContent
                            datauses={collection.dur}
                            anchorIndex={3}
                        />

                        <PublicationsContent
                            publications={publications}
                            anchorIndex={4}
                        />
                    </Box>
                </Box>
            }
        />
    );
}
