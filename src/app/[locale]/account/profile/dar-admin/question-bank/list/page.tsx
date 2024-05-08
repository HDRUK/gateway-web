"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { PaginationType } from "@/interfaces/Pagination";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Loading from "@/components/Loading";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import QuestionListItem from "./QuestionListItem/QuestionListItem";

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement`;

interface Question {
    id: number;
    created_at: string;
    user_name: string;
    version: number;
    question_json: string;
    locked: number;
    required: number;
    section_id: number;
}

const QuestionBankListPage = () => {
    const t = useTranslations(TRANSLATION_PATH);

    const searchParams = useSearchParams();

    const [queryParams, setQueryParams] = useState({
        category: "mandatory",
        status: "live",
    });

    useEffect(() => {
        const getStatusFromTab = (tab: string) => {
            switch (true) {
                case tab === "STANDARD":
                    return "live";
                case tab === "CUSTOM":
                    return "live";
                case tab === "ARCHVIED":
                    return "archived";
                default:
                    return "live";
            }
        };

        const getCategoryFromTab = (tab: string) => {
            switch (true) {
                case tab === "STANDARD":
                    return "mandatory";
                case tab === "CUSTOM":
                    return "custom";
                case tab === "ARCHVIED":
                    return "mandatory";
                default:
                    return "mandatory";
            }
        };

        setQueryParams(previous => ({
            ...previous,
            status: getStatusFromTab(searchParams?.get("tab") || "STANDARD"),
            category: getCategoryFromTab(
                searchParams?.get("tab") || "STANDARD"
            ),
        }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams?.get("tab")]);

    const { data, isLoading } = useGet<PaginationType<Question>>(
        `${apis.questionBankV1Url}/questions?${new URLSearchParams(
            queryParams
        )}`
    );
    if (isLoading) {
        return <Loading />;
    }

    const { currentPage, total, list } = data || {};

    const countStandard = list?.length;

    const tabsList = [
        { label: "Standard", value: "STANDARD", dsCount: countStandard ?? 0 },
        { label: "Custom", value: "CUSTOM", dsCount: 0 ?? 0 },
        { label: "Archived", value: "ARCHIVED", dsCount: 0 ?? 0 },
    ].map(tabItem => ({
        label: `${tabItem.label} (${tabItem.dsCount})`,
        value: tabItem.value,
        content: (
            <>
                <Box
                    data-testid="number-of-apps"
                    display="flex"
                    justifyContent="flex-end">
                    <Typography>
                        Page: <strong>{currentPage}</strong>, Showing:{" "}
                        <strong>
                            {list?.length} / {total || 0}
                        </strong>
                    </Typography>
                </Box>
                {list?.map(question => (
                    <QuestionListItem key={question?.id} data={question} />
                ))}{" "}
            </>
        ),
    }));

    return (
        <BoxContainer>
            <Box
                sx={{
                    gridColumn: { tablet: "span 3", laptop: "span 4" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                <Typography variant="h2">{t("title")}</Typography>

                <Tabs
                    centered
                    tabs={tabsList}
                    tabBoxSx={{ padding: 0 }}
                    rootBoxSx={{ padding: 0 }}
                />
            </Box>
        </BoxContainer>
    );
};

export default QuestionBankListPage;
