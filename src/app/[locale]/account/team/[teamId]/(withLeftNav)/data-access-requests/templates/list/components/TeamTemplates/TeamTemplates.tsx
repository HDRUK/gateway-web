"use client";

import { omit } from "lodash";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { DarTemplate } from "@/interfaces/DataAccessRequest";
import { PaginationType } from "@/interfaces/Pagination";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { ContentCopyIcon, EditIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import TemplateList from "../TemplateList";

interface TeamTemplatesProps {
    permissions?: { [key: string]: boolean };
    teamId: string;
    templateData: PaginationType<DarTemplate[]>;
    countActive: number;
    countDraft: number;
}

const TRANSLATION_PATH = `pages.account.team.dar.template.list`;

const TeamTemplates = ({
    permissions,
    templateData,
    countActive,
    countDraft,
    teamId,
}: TeamTemplatesProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { push } = useRouter();
    const searchParams = useSearchParams();

    const createTemplate = usePost(apis.dataAccessTemplateV1Url, {
        itemName: "DAR Template",
        successNotificationsOn: false,
    });

    const handleDuplicateTemplate = async (selectedId: number) => {
        const selectedTemplate = templateData?.list.find(
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

        const duplicatedTemplate = {
            ...selectedTemplate,
            questions: formattedQuestions,
        };

        await createTemplate({
            ...omit(duplicatedTemplate, [
                "id",
                "updated_at",
                "created_at",
                "deleted_at",
            ]),
        }).then(res =>
            push(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.DAR_TEMPLATES}/${res}`
            )
        );
    };

    const actions = [
        ...(permissions?.["data-access-template.update"]
            ? [
                  {
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.DAR_TEMPLATES}`,
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

    const tabsList = [
        {
            label: t("active"),
            value: "1",
            dsCount: countActive,
        },
        {
            label: t("draft"),
            value: "0",
            dsCount: countDraft,
        },
    ].map(tabItem => ({
        label: `${tabItem.label} (${tabItem.dsCount})`,
        value: tabItem.value,
        content: (
            <TemplateList
                list={templateData.list}
                setCurrentPage={page => {
                    const params = new URLSearchParams(
                        searchParams?.toString()
                    );
                    params.set("page", page.toString());
                    push(`?${params.toString()}`);
                }}
                isLoading={false}
                actions={actions}
                from={templateData.from}
                to={templateData.to}
                lastPage={templateData.lastPage}
                currentPage={templateData.currentPage}
                total={templateData.total}
            />
        ),
    }));

    return (
        <>
            <BackButton label={t("back")} />
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

            <Tabs
                centered
                tabs={tabsList}
                tabBoxSx={{ padding: 0, background: colors.white }}
                rootBoxSx={{ padding: 0 }}
                paramName="published"
            />
        </>
    );
};

export default TeamTemplates;
