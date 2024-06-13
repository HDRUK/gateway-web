import { get, isEmpty } from "lodash";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Box from "@/components/Box";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { getDataUse } from "@/utils/api";
import ActionBar from "./components/ActionBar";
import DataUseContent from "./components/DataUseContent";
import { dataUseFields } from "./config";

const TRANSLATION_PATH = "pages.dataUse";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Data Use",
    description: "",
};

export default async function DataUseItemPage({
    params,
}: {
    params: { dataUseId: string };
}) {
    const t = await getTranslations(TRANSLATION_PATH);

    const { dataUseId } = params;
    const cookieStore = cookies();
    const data = await getDataUse(cookieStore, dataUseId);

    const populatedSections = dataUseFields.filter(section =>
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
                        }}>
                        <Typography
                            variant="h2"
                            sx={{ pt: 0.5, pb: 0.5, m: 0 }}>
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
