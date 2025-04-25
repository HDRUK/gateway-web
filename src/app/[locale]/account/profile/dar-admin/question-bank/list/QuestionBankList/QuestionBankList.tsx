"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { PaginationType } from "@/interfaces/Pagination";
import { QuestionBankQuestion } from "@/interfaces/QuestionBankQuestion";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Link from "@/components/Link";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import ShowingXofX from "@/components/ShowingXofX";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";
import { ArchiveIcon, EditIcon, UnarchiveIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import QuestionListItem from "../QuestionBankListItem/QuestionBankListItem";

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement`;

const QuestionBankList = () => {
    const t = useTranslations(TRANSLATION_PATH);

    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);

    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.toString());
    queryParams.append("is_child", "0");
    const qs = queryParams.toString();

    const tab = searchParams?.get("tab") || "standard";

    const showArchiveButton = tab !== "archived";

    const {
        data,
        isLoading,
        mutate: mutateQuestions,
    } = useGet<PaginationType<QuestionBankQuestion>>(
        `${apis.questionBankV1Url}/${tab}?${qs}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const unArchiveQuestion = usePatch<Partial<QuestionBankQuestion>>(
        apis.questionBankV1Url,
        {
            subPath: "unarchive",
        }
    );

    const archiveQuestion = usePatch<Partial<QuestionBankQuestion>>(
        apis.questionBankV1Url,
        {
            subPath: "archive",
        }
    );

    const actions = [
        {
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}`,
            icon: EditIcon,
            label: t("edit.label"),
        },
        ...(showArchiveButton
            ? [
                  {
                      action: async (id: number) => {
                          await archiveQuestion(id, {});
                          mutateQuestions();
                      },
                      icon: ArchiveIcon,
                      label: t("actions.archive.label"),
                  },
              ]
            : [
                  {
                      action: async (id: number) => {
                          await unArchiveQuestion(id, {});
                          mutateQuestions();
                      },
                      icon: UnarchiveIcon,
                      label: t("actions.unarchive.label"),
                  },
              ]),
    ];

    const { lastPage } = data || {};

    if (isLoading) {
        return <Loading />;
    }

    const tabsList = [
        { label: "Standard", value: "standard" },
        { label: "Custom", value: "custom" },
        { label: "Archived", value: "archived" },
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
                {data?.list?.map(question => (
                    <QuestionListItem
                        key={question.question_id}
                        data={question}
                        actions={actions}
                    />
                ))}
                <Pagination
                    isLoading={isLoading}
                    page={currentPage}
                    count={lastPage}
                    onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                        setCurrentPage(page)
                    }
                />
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
