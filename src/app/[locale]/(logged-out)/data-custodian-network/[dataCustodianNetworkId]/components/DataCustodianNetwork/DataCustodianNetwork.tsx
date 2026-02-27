"use client"

import HeaderActionBar from "@/components/HeaderActionBar";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { Box, Typography } from "@mui/material";
import IntroductionContent from "../IntroductionContent";
import { Suspense } from "react";
import { NetworkSkeleton, SectionSkeleton } from "@/components/Skeletons";
import DataCustodianOuter from "../DataCustodianOuter";
import DatasetsOuter from "../DatasetsOuter";
import NetworkContent from "../NetworkContent";
import { StaticImages } from "@/config/images";
import { AspectRatioImage } from "@/consts/image";
import Image from "next/image";
import { RouteName } from "@/consts/routeName";
import { accordions } from "../../config";
import { useTranslations } from "next-intl";
import { NetworkSummary } from "@/interfaces/NetworkSummary";
import { Filter } from "@/interfaces/Filter";
import { FILTER_PUBLISHER_NAME } from "@/config/forms/filters";
import { DatasetsSummaryData, EntitiesSummaryData, NetworkCustodiansSummaryData } from "@/interfaces/DataCustodianNetwork";
import { SearchCategory } from "@/interfaces/Search";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

interface DataCustodianNetworkProps {
    infoData: NetworkSummary;
    dataNetworkCustodiansSummary: NetworkCustodiansSummaryData;
    dataNetworkDatasets: DatasetsSummaryData;
    dataNetworkCustodiansEntities: EntitiesSummaryData;
}

export default function DataCustodianNetwork({infoData, dataNetworkCustodiansSummary, dataNetworkDatasets, dataNetworkCustodiansEntities} : DataCustodianNetworkProps ) {
    const t = useTranslations(TRANSLATION_PATH);

    const activeLinkList = accordions.map(section => {
        return {
            label: t(section.sectionName),
        };
    });

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
                            datasets={dataNetworkDatasets}
                        />
                    </Suspense>
                    <Suspense fallback={<NetworkSkeleton />}>
                        <NetworkContent
                            entitiesSummaryData={dataNetworkCustodiansEntities}
                        />
                    </Suspense>
                </>
            }
        />
    );
}