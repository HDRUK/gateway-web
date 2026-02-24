"use client";

import { useMemo, useState } from "react";
import {
    Box,
    Collapse,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import DarStatusTracker from "@/components/DarStatusTracker";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";
import { formatDate } from "@/utils/date";

const TRANSLATION_PATH = "components.DataAccessHeader";
const DATE_FORMAT = "DD MMMM YYYY";

interface DarFormHeaderProps {
    applicationId: string;
    teamId?: string;
    userId?: string;
    saveDraftOnClick: () => Promise<void> | void | undefined;
    submitOnClick: () => Promise<void> | void | undefined;
    manageApplicationOnStatus: () => Promise<void> | void | undefined;
    isResearcher: boolean;
}

const DarActionBar = ({
    applicationId,
    teamId,
    userId,
    saveDraftOnClick,
    submitOnClick,
    manageApplicationOnStatus,
    isResearcher,
}: DarFormHeaderProps) => {
    const idTitle = `DAR Application ${applicationId}`;
    const t = useTranslations(TRANSLATION_PATH);

    const darApiPath = teamId
        ? `${apis.teamsV1Url}/${teamId}/dar/applications`
        : `${apis.usersV1Url}/${userId}/dar/applications`;
    const url = `${darApiPath}/${applicationId}/header`;
    const { data } = useGet<DataAccessRequestApplication>(url);

    const statuses = teamId
        ? [
              DarApplicationStatus.SUBMITTED,
              DarApplicationApprovalStatus.FEEDBACK,
          ]
        : [
              DarApplicationStatus.DRAFT,
              DarApplicationStatus.SUBMITTED,
              DarApplicationApprovalStatus.FEEDBACK,
          ];

    const approvalStatus = useMemo(
        () =>
            teamId
                ? data?.teams.find(team => team.team_id.toString() === teamId)
                      ?.approval_status
                : data?.teams[0]?.approval_status,
        [data?.teams, teamId]
    );

    const datasetChips = data?.datasets?.map(x => (
        <Chip label={x.dataset_title} key={x.dataset_id} />
    ));
    const [visible, setVisible] = useState<boolean>(false);

    const lastActivity = data?.updated_at
        ? formatDate(data?.updated_at, DATE_FORMAT)
        : "";

    const typographyDisplay = [
        {
            label: t("primaryInvestigator"),
            value: data?.primary_applicant?.name,
        },
        {
            label: t("organisation"),
            value: data?.primary_applicant?.organisation,
        },
        { label: t("datasets"), value: datasetChips },
        { label: t("lastActivity"), value: lastActivity },
    ];

    return (
        <Paper
            sx={{ padding: 2 }}
            onMouseOver={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}>
            <Grid container spacing={1}>
                <Grid size={2}>
                    <Typography variant="h2" color="primary">
                        {idTitle}
                    </Typography>
                </Grid>
                <Grid size={2} sx={{ alignItems: "center" }}>
                    <Typography>{data?.project_title}</Typography>
                </Grid>
            </Grid>

            <Collapse in={visible}>
                <Box>
                    <Grid container spacing={1} direction="row">
                        <Grid size="auto">
                            {typographyDisplay.map(({ label, value }) => (
                                <Box
                                    key={label}
                                    sx={{ display: "flex", gap: 2, mb: 0.5 }}>
                                    <Typography
                                        color="grey"
                                        sx={{ minWidth: 120 }}>
                                        {label}
                                    </Typography>
                                    <Typography>{value}</Typography>
                                </Box>
                            ))}
                        </Grid>
                        <Grid sx={{ ml: "auto", mr: 2 }}>
                            <DarStatusTracker
                                submissionStatus={
                                    data?.submission_status ||
                                    DarApplicationStatus.DRAFT
                                }
                                approvalStatus={approvalStatus}
                                statuses={statuses}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Collapse>

            <Divider />
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ my: 2, ml: 2 }}>
                {isResearcher ? (
                    <>
                        <Button color="greyCustom" onClick={saveDraftOnClick}>
                            {t("saveDraft")}
                        </Button>
                        <Button color="primary" onClick={submitOnClick}>
                            {t("submitApplication")}
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={manageApplicationOnStatus}>
                        {t("applicationStatus")}
                    </Button>
                )}
            </Stack>
            <Divider />
        </Paper>
    );
};

export { DarActionBar };
