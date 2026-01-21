import { get, isEmpty } from "lodash";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import CollectionsContent from "@/components/CollectionsContent";
import DataUsesContent from "@/components/DataUsesContent";
import DatasetsContent from "@/components/DatasetsContent";
import HeaderActionBar from "@/components/HeaderActionBar";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import ToolsContent from "@/components/ToolsContent";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { DataStatus } from "@/consts/application";
import { RouteName } from "@/consts/routeName";
import { getPublication } from "@/utils/api";
import metaData from "@/utils/metadata";
import PublicationContent from "./components/PublicationContent";
import { publicationFields, relatedContentAccordions } from "./config";

const TRANSLATION_PATH = "pages.publication";

export const metadata = metaData({
    title: "Publication",
    description: "",
});

export default async function PublicationItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const t = await getTranslations(TRANSLATION_PATH);

    const { id } = await params;
    const data = await getPublication(id, {
        suppressError: true,
    });

    if (!data || data?.status !== DataStatus.ACTIVE) notFound();

    const populatedSections = publicationFields.filter(section =>
        section.fields.some(field => !isEmpty(get(data, field.path)))
    );

    const activeLinkList = populatedSections
        .concat(relatedContentAccordions)
        .map(section => {
            return {
                label: t(section.sectionName),
            };
        });

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} />}
            body={
                <>
                    <HeaderActionBar
                        backButtonText={t("backLabel")}
                        backButtonHref={`/${RouteName.SEARCH}?type=${SearchCategory.TOOLS}`}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            px: 3,
                            py: 3,
                        }}>
                        <Typography
                            variant="h2"
                            sx={{ pt: 0.5, pb: 0.5, m: 0 }}>
                            <MarkDownSanitizedWithHtml
                                content={data.paper_title}
                                wrapper="span"
                            />
                        </Typography>

                        <PublicationContent
                            data={data}
                            populatedSections={populatedSections}
                        />

                        <DatasetsContent
                            datasets={data.datasets}
                            anchorIndex={populatedSections.length + 1}
                            translationPath={TRANSLATION_PATH}
                        />
                        <DataUsesContent
                            datauses={data.durs}
                            anchorIndex={populatedSections.length + 2}
                            translationPath={TRANSLATION_PATH}
                        />
                        <ToolsContent
                            tools={data.tools}
                            anchorIndex={populatedSections.length + 3}
                            translationPath={TRANSLATION_PATH}
                        />
                        <CollectionsContent
                            collections={data.collections}
                            anchorIndex={populatedSections.length + 4}
                            translationPath={TRANSLATION_PATH}
                        />
                    </Box>
                </>
            }
        />
    );
}
