import { get, isEmpty } from "lodash";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Box from "@/components/Box";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { getTool } from "@/utils/api";
import ActionBar from "./components/ActionBar";
import CollectionsContent from "./components/CollectionsContent";
import DatasetsContent from "./components/DatasetsContent";
import DatausesContent from "./components/DatausesContent";
import PublicationsContent from "./components/PublicationsContent";
import ToolContent from "./components/ToolContent";
import { toolFields } from "./config";

const TRANSLATION_PATH = "pages.tool";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Tool",
    description: "",
};

export default async function ToolPage({
    params,
}: {
    params: { toolId: string };
}) {
    const t = await getTranslations(TRANSLATION_PATH);

    const { toolId } = params;
    const cookieStore = cookies();
    const data = await getTool(cookieStore, toolId);

    const populatedSections = toolFields.filter(section =>
        section.fields.some(field => !isEmpty(get(data, field.path)))
    );

    const activeLinkList = populatedSections.map(section => {
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
                            anchorIndex={1}
                        />
                        <DatausesContent datauses={data.durs} anchorIndex={2} />
                        <PublicationsContent
                            publications={data.publications}
                            anchorIndex={3}
                        />
                        <CollectionsContent
                            collections={data.collections}
                            anchorIndex={4}
                        />
                    </Box>
                </>
            }
        />
    );
}
