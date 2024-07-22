import { get, isEmpty } from "lodash";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Image from "next/image";
import Box from "@/components/Box";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { getTeamSummary } from "@/utils/api";
import ActionBar from "./components/ActionBar";
import CollectionsContent from "./components/CollectionsContent";
import DataCustodianContent from "./components/DataCustodianContent";
import DatasetsContent from "./components/DatasetsContent";
import DatausesContent from "./components/DatausesContent";
import PublicationsContent from "./components/PublicationsContent";
import ToolsContent from "./components/ToolsContent";
import { dataCustodianFields, accordions } from "./config";

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

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} />}
            body={
                <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Image
                            width={554}
                            height={250}
                            alt={data.name}
                            src={"/images/data-providers/sample.thumbnail.jpg"}
                            style={{ objectFit: "scale-down" }}
                        />
                        <Typography
                            variant="h1">
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
                        />
                        <CollectionsContent
                            collections={data.collections}
                            anchorIndex={populatedSections.length + 2}
                        />
                        <ToolsContent
                            tools={data.tools}
                            anchorIndex={populatedSections.length + 3}
                        />
                        <DatausesContent
                            datauses={data.durs}
                            anchorIndex={populatedSections.length + 4}
                        />
                        <PublicationsContent
                            publications={data.publications}
                            anchorIndex={populatedSections.length + 5}
                        />
                        {/* Post-MVP: Service Offerings */}
                    </Box>
                </>
            }
        />
    );
}
