import { get, isEmpty } from "lodash";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Box from "@/components/Box";
import CollectionsContent from "@/components/CollectionsContent";
import DataUsesContent from "@/components/DataUsesContent";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import PublicationsContent from "@/components/PublicationsContent";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { getTool } from "@/utils/api";
import metaData from "@/utils/metdata";
import ActionBar from "./components/ActionBar";
import DatasetsContent from "./components/DatasetsContent";
import ToolContent from "./components/ToolContent";
import { toolFields, accordions } from "./config";

const TRANSLATION_PATH = "pages.tool";
export const metadata = metaData({
    title: "Tool",
    description: "",
});
export default async function ToolPage({
    params,
}: {
    params: { toolId: string };
}) {
    const t = await getTranslations(TRANSLATION_PATH);

    const { toolId } = params;
    const cookieStore = cookies();
    const data = await getTool(cookieStore, toolId, {
        suppressError: true,
    });

    if (!data) notFound();

    const populatedSections = toolFields.filter(section =>
        section.fields.some(field => !isEmpty(get(data, field.path)))
    );

    const activeLinkList = populatedSections.concat(accordions).map(section => {
        return {
            label: t(section.sectionName),
        };
    });

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} />}
            body={
                <>
                    <ActionBar />
                    <Box sx={{ px: 6, py: 3 }}>
                        <Typography variant="h2" sx={{ pt: 0.5, pb: 0.5 }}>
                            {data.name}
                        </Typography>
                        <ToolContent
                            data={data}
                            populatedSections={populatedSections}
                        />
                        <DatasetsContent
                            dataset_versions={data.dataset_versions}
                            anchorIndex={populatedSections.length + 1}
                        />
                        <DataUsesContent
                            datauses={data.durs}
                            anchorIndex={populatedSections.length + 2}
                            translationPath={TRANSLATION_PATH}
                        />
                        <PublicationsContent
                            publications={data.publications}
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
