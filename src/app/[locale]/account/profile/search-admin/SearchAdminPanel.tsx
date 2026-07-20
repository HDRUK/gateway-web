"use client";

import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { AdminSearchStatusResponse } from "@/interfaces/AdminSearch";
import FeatureFlagsTable from "./FeatureFlagsTable";
import SearchEntitiesTab from "./SearchEntitiesTab";
import DataCustodianNetworksTab from "./DataCustodianNetworksTab";

export default function SearchAdminPanel() {
    const { data, isLoading, mutate } = useGet<AdminSearchStatusResponse>(
        apis.adminSearchStatusV1Url
    );

    return (
        <Paper sx={{ maxWidth: "100%", overflow: "hidden" }}>
            <Box sx={{ maxWidth: "100%" }}>
                <Typography variant="h2">Admin Panel</Typography>
                <Typography sx={{ mb: 3 }}>
                    Monitor and manage the Typesense search indexes and
                    application feature flags.
                </Typography>

                <Tabs
                    rootBoxSx={{ p: 0 }}
                    tabBoxSx={{ p: 0 }}
                    tabs={[
                        {
                            label: "Feature flags",
                            value: "features",
                            content: (
                                <Box sx={{ p: 0, pt: 2 }}>
                                    <FeatureFlagsTable />
                                </Box>
                            ),
                        },
                        {
                            label: "Search entities",
                            value: "entities",
                            content: (
                                <Box sx={{ p: 0, pt: 2 }}>
                                    <SearchEntitiesTab
                                        data={data}
                                        isLoading={isLoading}
                                        mutate={mutate}
                                    />
                                </Box>
                            ),
                        },
                        {
                            label: "Data Custodian Networks",
                            value: "networks",
                            content: (
                                <Box sx={{ p: 0, pt: 2 }}>
                                    <DataCustodianNetworksTab />
                                </Box>
                            ),
                        },
                    ]}
                />
            </Box>
        </Paper>
    );
}
