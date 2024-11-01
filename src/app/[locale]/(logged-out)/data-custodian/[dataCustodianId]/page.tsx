import { get, isEmpty } from "lodash";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Box from "@/components/Box";
import CollectionsContent from "@/components/CollectionsContent";
import DataUsesContent from "@/components/DataUsesContent";
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
import DataCustodianContent from "./components/DataCustodianContent";
import { accordions, dataCustodianFields } from "./config";
import metaData from "@/utils/metdata";

const TRANSLATION_PATH = "pages.dataCustodian";


export const metadata = metaData(
    {
        title: "Data Custodian",
        description: ""
    })
export default async function DataCustodianItemPage({
    params,
}: {
    params: { dataCustodianId: string };
}) {
    const t = await getTranslations(TRANSLATION_PATH);

    const { dataCustodianId } = params;
    const cookieStore = cookies();

    const data = await getTeamSummary(cookieStore, dataCustodianId, {
        suppressError: true,
    });

    if (!data) notFound();

    const populatedSections = dataCustodianFields.filter(section =>
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
                    <ActionBar
                        team={{
                            id: data.id,
                            name: data.name,
                            member_of: data.member_of,
                        }}
                    />
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
                            translationPath={TRANSLATION_PATH}
                        />
                        <CollectionsContent
                            collections={data.collections}
                            anchorIndex={populatedSections.length + 2}
                            translationPath={TRANSLATION_PATH}
                        />
                        <ToolsContent
                            tools={data.tools}
                            anchorIndex={populatedSections.length + 3}
                            translationPath={TRANSLATION_PATH}
                        />
                        <DataUsesContent
                            datauses={data.durs}
                            anchorIndex={populatedSections.length + 4}
                            translationPath={TRANSLATION_PATH}
                        />
                        <PublicationsContent
                            publications={data.publications}
                            anchorIndex={populatedSections.length + 5}
                            translationPath={TRANSLATION_PATH}
                        />
                        {/* Post-MVP: Service Offerings */}
                    </Box>
                </>
            }
        />
    );
}
