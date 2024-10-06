import { get, isEmpty } from "lodash";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Box from "@/components/Box";
import DatasetsContent from "@/components/DatasetsContent";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import PublicationsContent from "@/components/PublicationsContent";
import ToolsContent from "@/components/ToolsContent";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { StaticImages } from "@/config/images";
import { AspectRatioImage } from "@/config/theme";
import { getTeamSummary } from "@/utils/api";
import ActionBar from "./components/ActionBar";
import CollectionsContent from "./components/CollectionsContent";
import DataCustodianContent from "./components/DataCustodianContent";
import DatausesContent from "./components/DatausesContent";
import { accordions, dataCustodianFields } from "./config";

const TRANSLATION_PATH = "pages.dataCustodian";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Data Custodian",
    description: "",
};

export default async function DataCustodianItemPage({
    params,
}: {
    params: { dataCustodianId: string };
}) {
    const t = await getTranslations(TRANSLATION_PATH);

    const { dataCustodianId } = params;
    const cookieStore = cookies();

    const data = await getTeamSummary(cookieStore, dataCustodianId);
    const populatedSections = dataCustodianFields.filter(section =>
        section.fields.some(field => !isEmpty(get(data, field.path)))
    );

    const activeLinkList = populatedSections.concat(accordions).map(section => {
        return {
            label: t(section.sectionName),
        };
    });

    const page = "dataCustodian";

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} />}
            body={
                <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AspectRatioImage
                            width={554}
                            height={250}
                            alt={data.name}
                            src={
                                data?.team_logo || StaticImages.BASE.placeholder
                            }
                        />
                        <Typography variant="h1" sx={{ ml: 2 }}>
                            {data.name}
                        </Typography>
                    </Box>
                    <ActionBar />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                        <DataCustodianContent
                            data={data}
                            populatedSections={populatedSections}
                        />
                        <DatasetsContent
                            datasets={data.datasets}
                            anchorIndex={populatedSections.length + 1}
                            page={page}
                        />
                        <CollectionsContent
                            collections={data.collections}
                            anchorIndex={populatedSections.length + 2}
                        />
                        <ToolsContent
                            tools={data.tools}
                            anchorIndex={populatedSections.length + 3}
                            page={page}
                        />
                        <DatausesContent
                            datauses={data.durs}
                            anchorIndex={populatedSections.length + 4}
                        />
                        <PublicationsContent
                            publications={data.publications}
                            anchorIndex={populatedSections.length + 5}
                            page={page}
                        />
                        {/* Post-MVP: Service Offerings */}
                    </Box>
                </>
            }
        />
    );
}
