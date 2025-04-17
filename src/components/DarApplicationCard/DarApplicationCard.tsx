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
import DarApplicationActionDialog from "@/modules/DarApplicationActionDialog";
import DarDatasetQuickViewDialog from "@/modules/DarDatasetQuickViewDialog";
import useDialog from "@/hooks/useDialog";
import { colors } from "@/config/theme";
import { DarEditIcon } from "@/consts/customIcons";
import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";
import {
    QueryBuilderOutlinedIcon,
    WithdrawIcon,
    DeleteIcon,
    EyeIcon,
} from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { formatDate } from "@/utils/date";

const TRANSLATION_PATH = "pages.account.team.dataAccessRequests.applications";
const CHARACTER_LIMIT = 50;
const DATE_FORMAT = "DD MMMM YYYY HH:mm";

interface DarApplicationCardProps {
    application: DataAccessRequestApplication;
    teamId?: string;
    teamIndex?: number;
    deleteApplication: (id: number) => void;
    withdrawApplication: (id: number) => void;
}

export default function DarApplicationCard({
    application,
    teamId,
    teamIndex,
    deleteApplication,
    withdrawApplication,
}: DarApplicationCardProps) {
    const t = useTranslations(TRANSLATION_PATH);
    const params = useParams<{ teamId: string }>();
    const { push } = useRouter();
    const { showDialog } = useDialog();

    const isResearcher = !params?.teamId;

    const submissionStatus = useMemo(
        () =>
            teamId
                ? application.teams.find(
                      team => team.team_id.toString() === teamId
                  )?.submission_status
                : application.teams[teamIndex || 0]?.submission_status,
        [application.teams, teamId]
    );

    const approvalStatus = useMemo(
        () =>
            teamId
                ? application.teams.find(
                      team => team.team_id.toString() === teamId
                  )?.approval_status
                : application.teams[teamIndex || 0]?.approval_status,
        [application.teams, teamId]
    );

    const cardContent = useMemo(
        () => [
            {
                ...(application.primary_applicant?.name &&
                    typeof application.primary_applicant?.name === "string" && {
                        text: t("primaryInvestigator"),
                        content: (
                            <Typography>
                                {application.primary_applicant?.name}
                            </Typography>
                        ),
                    }),
            },
            {
                ...(application.primary_applicant?.organisation &&
                    typeof application.primary_applicant?.organisation ===
                        "string" && {
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
                            text={
                                application.datasets[teamIndex || 0]
                                    .dataset_title
                            }
                            isButton
                            characterLimit={CHARACTER_LIMIT}
                            onClick={() =>
                                push(
                                    `/${RouteName.DATASET_ITEM}/${
                                        application.datasets[teamIndex || 0]
                                            .dataset_id
                                    }`
                                )
                            }
                        />
                        {application.datasets?.length > 1 && (
                            <Button
                                variant="text"
                                onClick={() =>
                                    showDialog(DarDatasetQuickViewDialog, {
                                        application,
                                        teamId,
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
        [application, teamId, push, showDialog, t]
    );

    const actionButtonHref = (id: number) =>
        teamId
            ? `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${
                  RouteName.DATA_ACCESS_REQUESTS
              }/${RouteName.APPLICATIONS}/${id}?teamId=${
                  teamId || application.teams[teamIndex || 0].team_id
              }`
            : `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${
                  RouteName.DATA_ACCESS_REQUESTS
              }/${RouteName.APPLICATIONS}/${id}?teamId=${
                  teamId || application.teams[teamIndex || 0].team_id
              }`;

    const canEdit = isResearcher
        ? submissionStatus === DarApplicationStatus.DRAFT ||
          (submissionStatus === DarApplicationStatus.SUBMITTED &&
              !approvalStatus)
        : submissionStatus === DarApplicationStatus.SUBMITTED &&
          (approvalStatus === DarApplicationApprovalStatus.FEEDBACK ||
              !approvalStatus);

    const actions = [
        ...(canEdit
            ? [
                  {
                      action: (id: number) => {
                          push(actionButtonHref(id));
                      },
                      icon: DarEditIcon,
                      label: t("editApplication"),
                  },
              ]
            : [
                  {
                      action: (id: number) => {
                          push(actionButtonHref(id));
                      },
                      icon: EyeIcon,
                      label: t("viewApplication"),
                  },
              ]),
        ...(isResearcher && submissionStatus === DarApplicationStatus.DRAFT
            ? [
                  {
                      action: (id: number) =>
                          showDialog(DarApplicationActionDialog, {
                              action: () => deleteApplication(id),
                              title: t("deleteTitle"),
                              intro: t("deleteIntro"),
                          }),
                      icon: DeleteIcon,
                      label: t("deleteApplication"),
                  },
              ]
            : []),
        ...(isResearcher &&
        approvalStatus === DarApplicationApprovalStatus.FEEDBACK
            ? [
                  {
                      action: (id: number) =>
                          showDialog(DarApplicationActionDialog, {
                              action: () => withdrawApplication(id),
                              title: t("withdrawTitle"),
                              intro: t("withdrawIntro"),
                          }),
                      icon: WithdrawIcon,
                      label: t("withdrawApplication"),
                  },
              ]
            : []),
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
                        submissionStatus={submissionStatus}
                        approvalStatus={approvalStatus}
                        statuses={
                            teamId
                                ? [
                                      DarApplicationStatus.SUBMITTED,
                                      DarApplicationApprovalStatus.FEEDBACK,
                                  ]
                                : [
                                      DarApplicationStatus.DRAFT,
                                      DarApplicationStatus.SUBMITTED,
                                      DarApplicationApprovalStatus.FEEDBACK,
                                  ]
                        }
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
                        {cardContent.map(item => {
                            if (!item.text) {
                                return null;
                            }

                            return (
                                <Fragment
                                    key={`${application.id}_${item.text}`}>
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
                            );
                        })}
                        {!!application.days_since_submission && (
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
                            display: "flex",
                            flexDirection: "column",
                        }}>
                        <CardActions actions={actions} id={+application.id} />
                    </Box>
                </Box>
            </BoxContainer>
        </Paper>
    );
}
