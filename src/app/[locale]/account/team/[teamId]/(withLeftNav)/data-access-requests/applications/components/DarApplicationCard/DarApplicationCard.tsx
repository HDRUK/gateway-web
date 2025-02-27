"use client";

import { Fragment, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import CardActions from "@/components/CardActions";
import DarStatusTracker from "@/components/DarStatusTracker";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import Paper from "@/components/Paper";
import ShowMore from "@/components/ShowMore";
import Typography from "@/components/Typography";
import DarDatasetQuickViewDialog from "@/modules/DarDatasetQuickViewDialog";
import useDialog from "@/hooks/useDialog";
import { colors } from "@/config/theme";
import { DarApplicationStatus } from "@/consts/dataAccess";
import {
    EditIcon,
    QueryBuilderOutlinedIcon,
    VisibilityOutlinedIcon,
} from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { formatDate } from "@/utils/date";

const TRANSLATION_PATH = "pages.account.team.dataAccessRequests.applications";
const CHARACTER_LIMIT = 50;
const DATE_FORMAT = "DD MMMM YYYY HH:mm";

interface DarApplicationCardProps {
    application: DataAccessRequestApplication;
}

export default function DarApplicationCard({
    application,
}: DarApplicationCardProps) {
    const t = useTranslations(TRANSLATION_PATH);
    const params = useParams<{
        teamId: string;
    }>();

    const { push } = useRouter();
    const { showDialog } = useDialog();

    const cardContent = useMemo(
        () => [
            {
                ...(application.primary_applicant?.name && {
                    text: t("primaryInvestigator"),
                    content: (
                        <Typography>
                            {application.primary_applicant?.name}
                        </Typography>
                    ),
                }),
            },
            {
                ...(application.primary_applicant?.organisation && {
                    text: t("organisation"),
                    content: (
                        <Typography>
                            {application.primary_applicant?.organisation}
                        </Typography>
                    ),
                }),
            },
            {
                text: t("datasets"),
                content: !!application.datasets?.length && (
                    <Box
                        sx={{ display: "flex", alignItems: "center", p: 0 }}
                        gap={1}>
                        <EllipsisCharacterLimit
                            text={application.datasets[0].dataset_title}
                            isButton
                            characterLimit={CHARACTER_LIMIT}
                            onClick={() =>
                                push(
                                    `/${RouteName.DATASET_ITEM}/${application.datasets[0].dataset_id}`
                                )
                            }
                        />
                        {application.datasets?.length > 1 && (
                            <Button
                                variant="text"
                                onClick={() =>
                                    showDialog(DarDatasetQuickViewDialog, {
                                        application,
                                        teamId: params?.teamId,
                                    })
                                }
                                sx={{ minWidth: "auto" }}>
                                ({application.datasets?.length})
                            </Button>
                        )}
                    </Box>
                ),
            },
            {
                text: t("lastActivity"),
                content: (
                    <Typography>
                        {formatDate(application.updated_at, DATE_FORMAT)}
                    </Typography>
                ),
            },
        ],
        [application, params?.teamId, push, showDialog, t]
    );

    const actions = [
        ...((application.submission_status === DarApplicationStatus.SUBMITTED &&
            !application.approval_status) ||
        application.submission_status === DarApplicationStatus.FEEDBACK
            ? [
                  {
                      action: (id: number) => {
                          push(
                              `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.APPLICATION}/${id}`
                          );
                      },
                      icon: EditIcon,
                      label: t("editApplication"),
                  },
              ]
            : [
                  {
                      action: (id: number) => {
                          push(
                              `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.APPLICATION}/${id}`
                          );
                      },
                      icon: VisibilityOutlinedIcon,
                      label: t("viewApplication"),
                  },
              ]),
    ];

    return (
        <Paper sx={{ mb: 1, p: 4, pr: 0 }}>
            <BoxContainer
                sx={{
                    display: "flex",
                }}>
                <Box
                    sx={{
                        flexGrow: 1,
                    }}>
                    <ShowMore maxHeight={24}>
                        <Typography fontSize={16}>
                            {application.project_title}
                        </Typography>
                    </ShowMore>

                    <DarStatusTracker
                        currentStatus={application.submission_status}
                        decisionStatus={application.approval_status}
                        statuses={[
                            DarApplicationStatus.SUBMITTED,
                            DarApplicationStatus.FEEDBACK,
                        ]}
                    />

                    <BoxContainer
                        sx={{
                            gridTemplateColumns: {
                                laptop: "repeat(4, 1fr)",
                            },
                            gap: 1,
                            "&:not(:last-of-type)": {
                                mb: 2,
                            },
                        }}>
                        {cardContent.map(item => (
                            <Fragment key="application.id">
                                <Box
                                    sx={{
                                        gridColumn: {
                                            laptop: "span 1",
                                        },
                                        p: 0,
                                    }}>
                                    <Typography color={colors.grey600}>
                                        {item.text}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        gridColumn: {
                                            laptop: "span 3",
                                        },
                                        p: 0,
                                        wordWrap: "break-word",
                                    }}>
                                    {item.content}
                                </Box>
                            </Fragment>
                        ))}
                        {application.days_since_submission && (
                            <Box sx={{ pl: 0, pt: 1, pb: 0 }}>
                                <Typography
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: colors.grey600,
                                    }}>
                                    <QueryBuilderOutlinedIcon sx={{ mr: 1 }} />
                                    {application.days_since_submission}
                                    {t("daysSinceStart")}
                                </Typography>
                            </Box>
                        )}
                    </BoxContainer>
                </Box>
                <Box
                    sx={{
                        p: 0,
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <Box
                        sx={{
                            p: 0,
                            borderLeft: `solid 1px ${colors.grey600}`,
                        }}>
                        <CardActions actions={actions} id={+application.id} />
                    </Box>
                </Box>
            </BoxContainer>
        </Paper>
    );
}
