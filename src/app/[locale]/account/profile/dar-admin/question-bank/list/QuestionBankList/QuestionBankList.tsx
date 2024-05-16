"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { PaginationType } from "@/interfaces/Pagination";
import { QuestionBankQuestion } from "@/interfaces/QuestionBankQuestion";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import ShowingXofX from "@/components/ShowingXofX";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { ArchiveIcon, EditIcon, UnarchiveIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import QuestionListItem from "../QuestionBankListItem/QuestionBankListItem";

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement`;

const QuestionBankList = () => {
    const t = useTranslations(TRANSLATION_PATH);

    const searchParams = useSearchParams();

    const [queryParams, setQueryParams] = useState({
        category: "mandatory",
        status: "live",
    });
    const tab = searchParams?.get("tab");

    const showArchiveButton = tab !== "ARCHIVED";

    const actions = [
        {
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}`,
            icon: EditIcon,
            label: t("edit.label"),
        },
        ...(showArchiveButton
            ? [
                  {
                      href: `/to-be-implemented`,
                      icon: ArchiveIcon,
                      label: t("archive.label"),
                  },
              ]
            : [
                  {
                      href: `/to-be-implemented`,
                      icon: UnarchiveIcon,
                      label: t("unarchive.label"),
                  },
              ]),
    ];

    useEffect(() => {
        const getStatusFromTab = (tab: string) => {
            switch (true) {
                case tab === "ARCHIVED":
                    return "archived";
                default:
                    return "-archived";
            }
        };

        const getCategoryFromTab = (tab: string) => {
            switch (true) {
                case tab === "CUSTOM":
                    return "custom";
                default:
                    return "-custom";
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

    const { data, isLoading } = useGet<PaginationType<QuestionBankQuestion>>(
        `${apis.questionBankV1Url}/questions?${new URLSearchParams(
            queryParams
        )}`
    );
    if (isLoading) {
        return <Loading />;
    }

    const { list } = data || {};

    const tabsList = [
        { label: "Standard", value: "STANDARD" },
        { label: "Custom", value: "CUSTOM" },
        { label: "Archived", value: "ARCHIVED" },
    ].map(tabItem => ({
        label: `${tabItem.label} `,
        value: tabItem.value,
        content: (
            <>
                <Box
                    sx={{ p: 0 }}
                    data-testid="number-of-apps"
                    display="flex"
                    justifyContent="space-between">
                    <Box sx={{ display: "flex", p: 0 }}>
                        <ShowingXofX
                            to={data?.to}
                            from={data?.from}
                            total={data?.total}
                        />
                    </Box>
                </Box>
                {list?.map(question => (
                    <QuestionListItem
                        key={question?.id}
                        data={question}
                        actions={actions}
                    />
                ))}{" "}
            </>
        ),
    }));

    return (
        <>
            <Paper>
                <BoxContainer>
                    <Box sx={{ paddingBottom: 2 }}>
                        <Typography variant="h2">{t("title")}</Typography>
                        <Typography>{t("text")}</Typography>
                        <Link
                            href={`/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}/${RouteName.CREATE}`}>
                            <Button> {t("create.label")} </Button>
                        </Link>
                    </Box>
                </BoxContainer>
            </Paper>
            <BoxContainer>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 3", laptop: "span 4" },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                    <Tabs
                        centered
                        tabs={tabsList}
                        tabBoxSx={{ padding: 0 }}
                        rootBoxSx={{ padding: 0 }}
                    />
                </Box>
            </BoxContainer>
        </>
    );
};

export default QuestionBankList;
