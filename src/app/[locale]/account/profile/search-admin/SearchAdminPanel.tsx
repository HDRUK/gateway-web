"use client";

import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import {
    FlagOutlinedIcon,
    SearchIcon,
    HubOutlinedIcon,
    NightsStayOutlinedIcon,
    InsertLinkOutlinedIcon,
    EmailOutlinedIcon,
    PeopleAltOutlinedIcon,
} from "@/consts/icons";
import { AdminSearchStatusResponse } from "@/interfaces/AdminSearch";
import FeatureFlagsTable from "./FeatureFlagsTable";
import SearchEntitiesTab from "./SearchEntitiesTab";
import DataCustodianNetworksTab from "./DataCustodianNetworksTab";
import NightlyDatasetTestsTab from "./NightlyDatasetTestsTab";
import DatasetLinkCheckResultsTab from "./DatasetLinkCheckResultsTab";
import EmailTemplatesTab from "./EmailTemplatesTab";
import UsersTab from "./UsersTab";

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
                    tabVariant="scrollable"
                    tabs={[
                        {
                            label: t("featureFlagsTab"),
                            value: "features",
                            icon: <FlagOutlinedIcon />,
                            content: (
                                <Box sx={{ p: 0, pt: 2 }}>
                                    <FeatureFlagsTable />
                                </Box>
                            ),
                        },
                        {
                            label: t("searchEntitiesTab"),
                            value: "entities",
                            icon: <SearchIcon />,
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
                            icon: <HubOutlinedIcon />,
                            content: (
                                <Box sx={{ p: 0, pt: 2 }}>
                                    <DataCustodianNetworksTab />
                                </Box>
                            ),
                        },
                        {
                            label: t("nightlyDatasetTestsTab"),
                            value: "nightlyDatasetTests",
                            icon: <NightsStayOutlinedIcon />,
                            content: (
                                <Box sx={{ p: 0, pt: 2 }}>
                                    <NightlyDatasetTestsTab />
                                </Box>
                            ),
                        },
                        {
                            label: t("datasetLinkCheckResultsTab"),
                            value: "datasetLinkCheckResults",
                            icon: <InsertLinkOutlinedIcon />,
                            content: (
                                <Box sx={{ p: 0, pt: 2 }}>
                                    <DatasetLinkCheckResultsTab />
                                </Box>
                            ),
                        },
                        {
                            label: t("emailTemplatesTab"),
                            value: "emailTemplates",
                            icon: <EmailOutlinedIcon />,
                            content: (
                                <Box sx={{ p: 0, pt: 2 }}>
                                    <EmailTemplatesTab />
                                </Box>
                            ),
                        },
                        {
                            label: t("usersTab"),
                            value: "users",
                            icon: <PeopleAltOutlinedIcon />,
                            content: (
                                <Box sx={{ p: 0, pt: 2 }}>
                                    <UsersTab />
                                </Box>
                            ),
                        },
                    ]}
                />
            </Box>
        </Paper>
    );
}
