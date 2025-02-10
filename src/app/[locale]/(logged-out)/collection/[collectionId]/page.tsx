import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Box from "@/components/Box";
import DataUsesContent from "@/components/DataUsesContent";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import PublicationsContent from "@/components/PublicationsContent";
import ToolsContent from "@/components/ToolsContent";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { StaticImages } from "@/config/images";
import { AspectRatioImage } from "@/config/theme";
import { DataStatus } from "@/consts/application";
import { getReducedCollection } from "@/utils/api";
import metaData from "@/utils/metadata";
import { toTitleCase } from "@/utils/string";
import ActionBar from "./components/ActionBar";
import DatasetsContent from "./components/DatasetsContent";
import { collectionSections } from "./config";

export const metadata = metaData({
    title: "Collection",
    description: "",
});

const TRANSLATION_PATH = "pages.collection";

export default async function CollectionItemPage({
    params,
}: {
    params: { collectionId: string };
}) {
    const { collectionId } = params;
    const cookieStore = cookies();
    const t = await getTranslations(TRANSLATION_PATH);
    const collection = await getReducedCollection(cookieStore, collectionId, {
        suppressError: true,
    });

    // Note that the status check is only required under v1 - under v2, we can use
    // an endpoint that will not show the data if not active
    if (!collection || collection?.status !== DataStatus.ACTIVE) notFound();

    const {
        name,
        image_link,
        description,
        tools,
        dur,
        dataset_versions,
        publications,
    } = collection;

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
                            alt={toTitleCase(name)}
                            src={image_link || StaticImages.BASE.placeholder}
                        />
                        <Typography variant="h1" sx={{ ml: 2 }}>
                            {name}
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
                            <MarkDownSanitizedWithHtml content={description} />
                        </Box>
                        <Box>
                            <DatasetsContent
                                datasets={dataset_versions}
                                anchorIndex={1}
                            />

                            <ToolsContent
                                tools={tools}
                                anchorIndex={2}
                                translationPath={TRANSLATION_PATH}
                            />

                            <DataUsesContent
                                datauses={dur}
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
