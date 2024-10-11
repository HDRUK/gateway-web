import Markdown from "markdown-to-jsx";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { VersionItem } from "@/interfaces/Dataset";
import { Publication } from "@/interfaces/Publication";
import Box from "@/components/Box";
import DataUsesContent from "@/components/DataUsesContent";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import PublicationsContent from "@/components/PublicationsContent";
import ToolsContent from "@/components/ToolsContent";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { StaticImages } from "@/config/images";
import { AspectRatioImage } from "@/config/theme";
import { getCollection, getDataset } from "@/utils/api";
import { removeEmpty } from "@/utils/array";
import { getLatestVersion } from "@/utils/dataset";
import { toTitleCase } from "@/utils/string";
import ActionBar from "./components/ActionBar";
import DatasetsContent from "./components/DatasetsContent";
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

    const datasetsLatestVersions = datasets.map(dataset =>
        getLatestVersion(dataset)
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AspectRatioImage
                            width={554}
                            height={250}
                            alt={toTitleCase(collection.name)}
                            src={
                                collection.image_link ||
                                StaticImages.BASE.placeholder
                            }
                        />
                        <Typography variant="h1" sx={{ ml: 2 }}>
                            {collection.name}
                        </Typography>
                    </Box>

                    <Box sx={{ px: 6, py: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <ActionBar />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h3" sx={{ mb: 1 }}>
                                {t("introTitle")}
                            </Typography>
                            <Markdown>{collection.description}</Markdown>
                        </Box>
                        <Box>
                            <DatasetsContent
                                datasets={datasets}
                                anchorIndex={1}
                            />

                            <ToolsContent
                                tools={collection.tools}
                                anchorIndex={2}
                                translationPath={TRANSLATION_PATH}
                            />

                            <DataUsesContent
                                datauses={collection.dur}
                                anchorIndex={3}
                                translationPath={TRANSLATION_PATH}
                            />

                            <PublicationsContent
                                publications={publications}
                                anchorIndex={4}
                                translationPath={TRANSLATION_PATH}
                            />
                        </Box>
                    </Box>
                </>
            }
        />
    );
}
