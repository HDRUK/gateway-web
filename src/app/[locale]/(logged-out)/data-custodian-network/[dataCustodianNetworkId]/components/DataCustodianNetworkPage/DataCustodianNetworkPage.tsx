"use client";

import { Suspense, useMemo, useState } from "react";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
    DatasetsSummaryData,
    EntitiesSummaryData,
    NetworkCustodiansSummaryData,
} from "@/interfaces/DataCustodianNetwork";
import { Filter, FilterValues } from "@/interfaces/Filter";
import { NetworkSummary } from "@/interfaces/NetworkSummary";
import { SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import HeaderActionBar from "@/components/HeaderActionBar";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import { NetworkSkeleton, SectionSkeleton } from "@/components/Skeletons";
import ActiveListSidebarWithFilter from "@/modules/ActiveListSidebarWithFilter";
import { FILTER_PUBLISHER_NAME } from "@/config/forms/filters";
import { StaticImages } from "@/config/images";
import { LogoImage } from "@/consts/image";
import { RouteName } from "@/consts/routeName";
import { accordions } from "../../config";
import DataCustodianOuter from "../DataCustodianOuter";
import DatasetsOuter from "../DatasetsOuter";
import IntroductionContent from "../IntroductionContent";
import NetworkContent from "../NetworkContent";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

interface DataCustodianNetworkProps {
    infoData: NetworkSummary;
    dataNetworkCustodiansSummary: NetworkCustodiansSummaryData;
    dataNetworkDatasets: DatasetsSummaryData;
    dataNetworkCustodiansEntities: EntitiesSummaryData;
}

export default function DataCustodianNetworkPage({
    infoData,
    dataNetworkCustodiansSummary,
    dataNetworkDatasets,
    dataNetworkCustodiansEntities,
}: DataCustodianNetworkProps) {
    const t = useTranslations(TRANSLATION_PATH);

    const activeLinkList = accordions.map(section => ({
        label: t(section.sectionName),
    }));

    const publisherFilter: Filter = {
        keys: FILTER_PUBLISHER_NAME,
        value: FILTER_PUBLISHER_NAME,
        buckets: dataNetworkCustodiansSummary.teams_counts.map(team => ({
            key: team.name,
            doc_count: team.datasets_count || 0,
        })),
        id: 0,
        enabled: true,
        type: "dataset",
    };

    const teams = dataNetworkCustodiansSummary.teams_counts.reduce(
        (acc, team) => {
            if (team.name && team.id) {
                acc[team.name] = team.id;
            }
            return acc;
        },
        {} as Record<string, string>
    );

    const [filterValues, setFilterValues] = useState<FilterValues>({});

    const selectedTeamIds = useMemo(
        () =>
            new Set(
                Object.entries(filterValues)
                    .filter(([, checked]) => checked)
                    .map(([name]) => teams[name])
            ),
        [filterValues, teams]
    );

    return (
        <LayoutDataItemPage
            navigation={
                <ActiveListSidebarWithFilter
                    items={activeLinkList}
                    filter={publisherFilter}
                    filterValues={filterValues}
                    onFilterChange={setFilterValues}
                />
            }
            body={
                <>
                    <HeaderActionBar
                        backButtonText={t("backLabel")}
                        backButtonHref={`/${RouteName.SEARCH}?type=${SearchCategory.COLLECTIONS}`}
                        wrapperSx={{ boxShadow: 0 }}
                    />
                    <Box sx={{ pb: 0 }}>
                        <Typography variant="h2" component="h1">
                            {infoData.name}
                        </Typography>
                    </Box>
                    <BoxContainer
                        sx={{
                            gridTemplateColumns: {
                                md: "repeat(5, 1fr)",
                            },
                            gap: {
                                xs: 1,
                                sm: 2,
                            },
                        }}>
                        <Box
                            sx={{
                                gridColumn: { md: "span 3" },
                                py: 0,
                            }}>
                            <IntroductionContent
                                networkData={infoData}
                                anchorIndex={0}
                            />
                        </Box>
                        <Box
                            sx={{
                                gridColumn: { md: "span 2" },
                                py: 0,
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: {
                                    md: "flex-end",
                                    sm: "center",
                                },
                            }}>
                            <Image
                                width={554}
                                height={250}
                                alt={infoData.name}
                                src={
                                    infoData?.img_url ||
                                    StaticImages.BASE.placeholder
                                }
                                style={LogoImage}
                                sizes="(max-width: 768px) 100vw, 554px"
                            />
                        </Box>
                    </BoxContainer>
                    <Suspense
                        fallback={<SectionSkeleton title="Data Custodians" />}>
                        <DataCustodianOuter
                            custodiansSummaryData={dataNetworkCustodiansSummary}
                            selectedTeamIds={selectedTeamIds}
                        />
                    </Suspense>
                    <Suspense fallback={<SectionSkeleton title="Datasets" />}>
                        <DatasetsOuter
                            datasets={dataNetworkDatasets}
                            associatedDatasets={
                                dataNetworkCustodiansEntities.associated_datasets ??
                                []
                            }
                            selectedTeamIds={selectedTeamIds}
                        />
                    </Suspense>
                    <Suspense fallback={<NetworkSkeleton />}>
                        <NetworkContent
                            entitiesSummaryData={dataNetworkCustodiansEntities}
                            selectedTeamIds={selectedTeamIds}
                        />
                    </Suspense>
                </>
            }
        />
    );
}
