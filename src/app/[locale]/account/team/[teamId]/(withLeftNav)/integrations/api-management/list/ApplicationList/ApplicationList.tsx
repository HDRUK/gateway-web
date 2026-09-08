"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { tokens } from "@hdruk/ui/theme";
import { Application } from "@/interfaces/Application";
import { PaginationType } from "@/interfaces/Pagination";
import BoxContainer from "@/components/BoxContainer";
import Pagination from "@/components/Pagination";
import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { ApplicationStatus } from "@/consts/application";
import ApplicationListItem from "./ApplicationListItem";
import ApplicationSearchBar from "./ApplicationSearchBar";

const TRANSLATION_PATH = `pages.account.team.integrations.apiManagement.list`;

const statusByTab: { [key: string]: string } = {
    [ApplicationStatus.ALL]: "",
    [ApplicationStatus.ENABLED]: "1",
    [ApplicationStatus.DISABLED]: "0",
};

const ApplicationList = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const searchParams = useSearchParams();
    const params = useParams<{
        teamId: string;
    }>();

    const tab = searchParams?.get("tab") || ApplicationStatus.ALL;

    const [queryParams, setQueryParams] = useState({
        team_id: `${params?.teamId}`,
        status: "",
        text: "",
        page: "1",
        per_page: "10",
    });

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            status: statusByTab[tab] ?? "",
            page: "1",
        }));
    }, [tab]);

    const { data, isLoading } = useGet<PaginationType<Application>>(
        `${apis.applicationsV1Url}?${new URLSearchParams(queryParams)}`,
        {
            keepPreviousData: true,
            withPagination: true,
            itemName: "applications",
        }
    );

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [queryParams.page]);

    const { lastPage, list } = data || {};

    const tabsList = Object.values(ApplicationStatus).map(value => ({
        label: t(`tabs.${value}`),
        value,
    }));

    return (
        <BoxContainer>
            <Tabs
                centered
                tabs={tabsList}
                renderTabContent={false}
                defaultSelectedTab={ApplicationStatus.ALL}
                tabBoxSx={{ padding: 0, background: tokens.background.white }}
                rootBoxSx={{ padding: 0 }}
            />

            <ApplicationSearchBar setQueryParams={setQueryParams} />

            {list?.map(application => (
                <ApplicationListItem
                    key={application.id}
                    application={application}
                />
            ))}
            <Pagination
                isLoading={isLoading}
                page={parseInt(queryParams.page, 10)}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setQueryParams({ ...queryParams, page: page.toString() })
                }
            />
        </BoxContainer>
    );
};

export default ApplicationList;
