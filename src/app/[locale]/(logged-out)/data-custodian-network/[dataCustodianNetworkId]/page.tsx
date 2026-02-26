import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import HeaderActionBar from "@/components/HeaderActionBar";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import { NetworkSkeleton, SectionSkeleton } from "@/components/Skeletons";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { StaticImages } from "@/config/images";
import { AspectRatioImage } from "@/consts/image";
import { RouteName } from "@/consts/routeName";
import { getFilters, getNetworkCustodiansSummary, getNetworkInfo } from "@/utils/api";
import metaData from "@/utils/metadata";
import DataCustodianOuter from "./components/DataCustodianOuter";
import DatasetsOuter from "./components/DatasetsOuter";
import IntroductionContent from "./components/IntroductionContent";
import NetworkContent from "./components/NetworkContent";
import { accordions } from "./config";
import { Filter } from "@/interfaces/Filter";
import { FILTER_COLLECTION_NAME, FILTER_DATA_SUBTYPE, FILTER_PUBLISHER_NAME } from "@/config/forms/filters";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

export const metadata = metaData({
    title: "Data Custodian Network",
    description: "",
});

export default async function DataCustodianNetworkPage({
    params,
}: {
    params: Promise<{ dataCustodianNetworkId: string }>;
}) {
    const t = await getTranslations(TRANSLATION_PATH);

    const { dataCustodianNetworkId } = await params;

    const infoData = await getNetworkInfo(dataCustodianNetworkId, {
        suppressError: true,
    });

    if (!infoData) notFound();

    const activeLinkList = accordions.map(section => {
        return {
            label: t(section.sectionName),
        };
    });


    const dataNetworkCustodiansSummary = await getNetworkCustodiansSummary(dataCustodianNetworkId);

    const publisherFilter: Filter = {
        keys: FILTER_PUBLISHER_NAME,
        value: FILTER_PUBLISHER_NAME,
        buckets: dataNetworkCustodiansSummary.teams_counts.map(team => ({
            key: team.name,
            doc_count: team.datasets_count || 0,
        })),
        id: 0,
        enabled: true,
        type: "dataset"
    };

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} filter={publisherFilter} />}
            body={
                <>
                    <Typography variant="h1" sx={{ ml: 2, mt: 2 }}>
                        {infoData.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 0 }}>
                        <Image
                            width={554}
                            height={250}
                            alt={infoData.name}
                            src={
                                infoData?.img_url ||
                                StaticImages.BASE.placeholder
                            }
                            style={AspectRatioImage}
                        />
                    </Box>
                    <HeaderActionBar
                        backButtonText={t("backLabel")}
                        backButtonHref={`/${RouteName.SEARCH}?type=${SearchCategory.COLLECTIONS}`}
                        wrapperSx={{ boxShadow: 0 }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                        <IntroductionContent
                            networkData={infoData}
                            anchorIndex={0}
                        />
                    </Box>
                    <Suspense
                        fallback={<SectionSkeleton title="Data Custodians" />}>
                        <DataCustodianOuter
                            custodiansSummaryData={dataNetworkCustodiansSummary}
                        />
                    </Suspense>
                    <Suspense fallback={<SectionSkeleton title="Datasets" />}>
                        <DatasetsOuter
                            dataCustodianNetworkId={+dataCustodianNetworkId}
                        />
                    </Suspense>
                    <Suspense fallback={<NetworkSkeleton />}>
                        <NetworkContent
                            dataCustodianNetworkId={+dataCustodianNetworkId}
                        />
                    </Suspense>
                </>
            }
        />
    );
}
