"use client";

import { useState } from "react";
import { omit } from "lodash";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { DarTemplate } from "@/interfaces/DataAccessRequest";
import { PaginationType } from "@/interfaces/Pagination";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { ContentCopyIcon, EditIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import TemplateList from "../TemplateList";

interface TeamTemplatesProps {
    permissions?: { [key: string]: boolean };
    teamId?: string;
}

const TRANSLATION_PATH = `pages.account.team.dar.template.list`;

const TeamTemplates = ({ permissions, teamId }: TeamTemplatesProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { push } = useRouter();
    const params = useParams<{ teamId: string }>();

    const createTemplate = usePost(apis.dataAccessTemplateV1Url, {
        itemName: "DAR Template",
        successNotificationsOn: false,
    });

    const [queryParams, setQueryParams] = useState({
        page: "1",
    });

    const { data, isLoading } = useGet<PaginationType<DarTemplate>>(
        `${apis.teamsV1Url}/${
            params?.teamId
        }/dar/templates?${new URLSearchParams(queryParams)}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const handleDuplicateTemplate = async (selectedId: number) => {
        const selectedTemplate = data?.list.find(
            item => item.id === selectedId
        );

        const formattedQuestions = selectedTemplate?.questions.map(t => {
            return {
                id: t.question_id,
                guidance: t.guidance,
                required: t.required,
                order: t.order,
            };
        });

        const test = { ...selectedTemplate, questions: formattedQuestions };

        await createTemplate({
            ...omit(test, ["id", "updated_at", "created_at", "deleted_at"]),
        }).then(res =>
            push(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.DAR_TEMPLATES}/${res}`
            )
        );
    };

    const actions = [
        ...(permissions?.["data-access-template.update"]
            ? [
                  {
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.DAR_TEMPLATES}`,
                      icon: EditIcon,
                      label: t("actions.edit.label"),
                  },
              ]
            : []),
        ...(permissions?.["data-access-template.create"]
            ? [
                  {
                      icon: ContentCopyIcon,
                      label: t("actions.duplicate.label"),
                      action: handleDuplicateTemplate,
                  },
              ]
            : []),
    ];

    return (
        <>
            <Paper>
                <Box
                    sx={{
                        bgcolor: "white",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <Box sx={{ flexGrow: 1, p: 0 }}>
                        <Typography variant="h2">{t("title")}</Typography>
                        <Typography>{t("intro")}</Typography>
                    </Box>
                </Box>
            </Paper>

            <TemplateList
                {...data}
                key={"active"}
                list={data?.list}
                currentPage={parseInt(queryParams.page, 10)}
                setCurrentPage={page =>
                    setQueryParams({
                        ...queryParams,
                        page: page.toString(),
                    })
                }
                isLoading={isLoading}
                actions={actions}
            />
        </>
    );
};

export default TeamTemplates;
