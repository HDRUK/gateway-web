import { Box, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { VersionItem } from "@/interfaces/Dataset";
import { Publication } from "@/interfaces/Publication";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import PageBanner from "@/components/PageBanner";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { getCollection, getDataset } from "@/utils/api";
import { removeEmpty } from "@/utils/array";
import { getLatestVersion } from "@/utils/dataset";
import { toTitleCase } from "@/utils/string";
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

const TRANSLATION_PATH = "pages.collection";

export default async function CollectionItemPage({
    params,
}: {
    params: { collectionId: string };
}) {
    const { collectionId } = params;
    const cookieStore = cookies();
    const t = await getTranslations(TRANSLATION_PATH);
    const collection = await getCollection(cookieStore, collectionId);

    const datasets = await Promise.all(
        collection.datasets.map(({ id }) =>
            getDataset(cookieStore, id.toString())
        )
    );

    const datasetsLatestVersions = datasets.map(({ versions }) =>
        getLatestVersion(versions)
    );

    const publications = removeEmpty(
        datasetsLatestVersions.reduce(
            (item: Publication[], datasetVersion: VersionItem) => {
                return item.concat(datasetVersion.publications);
            },
            []
        )
    );

    const activeLinkList = collectionSections.map(({ sectionName: label }) => {
        return { label };
    });

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} />}
            body={
                <>
                    <PageBanner backgroundImageUrl="/images/collections/banner.jpeg">
                        {toTitleCase(collection.name)}
                    </PageBanner>
                    <Box sx={{ px: 6, py: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <ActionBar />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h3" sx={{ mb: 1 }}>
                                {t("introTitle")}
                            </Typography>
                            <Typography>{collection.description}</Typography>
                        </Box>
                        <Box>
                            <DatasetsContent
                                datasets={datasets}
                                anchorIndex={1}
                            />

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
                </>
            }
        />
    );
}
