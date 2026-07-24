"use client";

import { useTranslations } from "next-intl";
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

const TRANSLATION_PATH = "pages.account.profile.searchAdmin";

export default function SearchAdminPanel() {
    const t = useTranslations(TRANSLATION_PATH);
    const { data, isLoading, mutate } = useGet<AdminSearchStatusResponse>(
        apis.adminSearchStatusV1Url
    );

    return (
        <Paper sx={{ maxWidth: "100%", overflow: "hidden" }}>
            <Box sx={{ maxWidth: "100%" }}>
                <Typography variant="h2">{t("title")}</Typography>
                <Typography sx={{ mb: 3 }}>{t("text")}</Typography>

                <Tabs
                    rootBoxSx={{ p: 0 }}
                    tabBoxSx={{ p: 0 }}
                    tabs={[
                        {
                            label: t("featureFlagsTab"),
                            value: "features",
                            content: (
                                <Box sx={{ p: 0, pt: 2 }}>
                                    <FeatureFlagsTable />
                                </Box>
                            ),
                        },
                        {
                            label: t("searchEntitiesTab"),
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
                            label: t("dataCustodianNetworksTab"),
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
