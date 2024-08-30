import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Image from "next/image";
import Box from "@/components/Box";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { getDataCustodianNetworks, getNetworkSummary } from "@/utils/api";
import ActionBar from "./components/ActionBar";
import DataCustodianContent from "./components/DataCustodianContent";
import DatasetsContent from "./components/DatasetsContent";
import DatausesContent from "./components/DatausesContent";
import IntroductionContent from "./components/IntroductionContent";
import PublicationsContent from "./components/PublicationsContent";
import ToolsContent from "./components/ToolsContent";
import { accordions } from "./config";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";
const testobject = [
    {
        name: "PUBLIC HEALTH SCOTLAND",
        datasets_count: 30,
        durs_count: 51,
        publications_count: 27,
        tools_count: 1,
        collections_count: 17,
    },
    {
        name: "DataLoch",
        datasets_count: 12,
        durs_count: 11,
        publications_count: 0,
        tools_count: 0,
        collections_count: 2,
    },
    {
        name: "West of Scotland Safe Haven",
        datasets_count: 10,
        durs_count: 0,
        publications_count: 0,
        tools_count: 0,
        collections_count: 1,
    },
    {
        name: "PUBLIC HEALTH SCOTLAND",
        datasets_count: 30,
        durs_count: 51,
        publications_count: 27,
        tools_count: 1,
        collections_count: 17,
    },
    {
        name: "DataLoch",
        datasets_count: 12,
        durs_count: 11,
        publications_count: 0,
        tools_count: 0,
        collections_count: 2,
    },
    {
        name: "West of Scotland Safe Haven",
        datasets_count: 10,
        durs_count: 0,
        publications_count: 0,
        tools_count: 0,
        collections_count: 1,
    },
];

export default async function DataCustodianNetworkPage({
    params,
}: {
    params: { dataCustodianNetworkId: string };
}) {
    const t = await getTranslations(TRANSLATION_PATH);

    const { dataCustodianNetworkId } = params;
    const cookieStore = cookies();

    const summaryData = await getNetworkSummary(
        cookieStore,
        dataCustodianNetworkId
    );
    const networkData = await getDataCustodianNetworks(
        cookieStore,
        dataCustodianNetworkId
    );
    const { summary, id } = networkData;

    const activeLinkList = accordions.map(section => {
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
                            alt={summaryData.name}
                            src="/images/data-providers/sample.thumbnail.jpg"
                            style={{ objectFit: "scale-down" }}
                        />
                        <Typography variant="h1">{summaryData.name}</Typography>
                    </Box>
                    <ActionBar />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                        <IntroductionContent
                            content={summary}
                            anchorIndex={0}
                        />

                        <DataCustodianContent
                            dataCustodians={testobject}
                            id={id}
                            anchorIndex={1}
                        />
                        <DatasetsContent
                            datasets={summaryData.datasets}
                            anchorIndex={2}
                        />
                        <ToolsContent
                            tools={summaryData.tools}
                            anchorIndex={3}
                        />
                        <DatausesContent
                            datauses={summaryData.durs}
                            anchorIndex={4}
                        />
                        <PublicationsContent
                            publications={summaryData.publications}
                            anchorIndex={5}
                        />
                        {/* Post-MVP: Service Offerings */}
                    </Box>
                </>
            }
        />
    );
}
