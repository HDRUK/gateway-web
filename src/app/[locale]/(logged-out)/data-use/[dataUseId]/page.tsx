import { get, isEmpty } from "lodash";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Box from "@/components/Box";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { DataStatus, PAGE_TITLE_FALLBACKS } from "@/consts/application";
import { RouteName } from "@/consts/routeName";
import { getDataUse } from "@/utils/api";
import metaData from "@/utils/metadata";
import ActionBar from "./components/ActionBar";
import DataUseContent from "./components/DataUseContent";
import { dataUseFields } from "./config";

const TRANSLATION_PATH = "pages.dataUse";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; dataUseId: string }>;
}) {
    const { locale, dataUseId } = await params;
    const data = await getDataUse(dataUseId, {
        suppressError: true,
    });

    return metaData({
        title: data?.project_title || PAGE_TITLE_FALLBACKS.dataUse,
        description: data?.lay_summary,
        url: `/${locale}/${RouteName.DATA_USE_ITEM}/${dataUseId}`,
        entity: { type: "dataUse", id: dataUseId },
    });
}
export default async function DataUseItemPage({
    params,
}: {
    params: Promise<{ dataUseId: string }>;
}) {
    const t = await getTranslations(TRANSLATION_PATH);

    const { dataUseId } = await params;
    const data = await getDataUse(dataUseId, {
        suppressError: true,
    });

    // Note that the status check is only required under v1 - under v2, we can use
    // an endpoint that will not show the data if not active
    if (!data || data?.status !== DataStatus.ACTIVE) notFound();

    const populatedSections = dataUseFields.filter(
        section =>
            section.alwaysRender ||
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
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            px: 3,
                            py: 3,
                        }}>
                        <Typography
                            variant="articleLead"
                            component="h2"
                            sx={{ pt: 0.5, pb: 0.5, m: 0 }}
                            id="anchor1">
                            {data.project_title}
                        </Typography>
                        <DataUseContent
                            data={data}
                            populatedSections={populatedSections}
                        />
                    </Box>
                </>
            }
        />
    );
}
