import { Box, Paper, Typography } from "@mui/material"
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import BoxContainer from "@/components/BoxContainer";
import DarStatusTracker from "@/components/DarStatusTracker";
import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";

const TRANSLATION_PATH = "components.DataAccessheader";

interface DarFormHeaderProps {
    application: DataAccessRequestApplication;
}

const DarFormHeader = ({
    application,
} : DarFormHeaderProps) => {

    const idTitle = `DAR Application ${application.id}`;
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Paper>
            <BoxContainer sx={{ display: 'flex', gap: 2, padding: 2}}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h2" color="primary">{idTitle}</Typography>
                </Box>
                <Box sx={{ flex: 3 }} >
                    <Typography>{application.project_title}</Typography>
                </Box>
            </BoxContainer>

            <Box>
                <Button color="greyCustom">{t("saveDraft")}</Button>
                <Button variant="outlined" color="secondary">{t("assignWorkflow")}</Button>
                <Button variant="outlined" color="secondary">{t("applicationStatus")}</Button>
                <Button color="primary">{t("submitApplication")}</Button>
            </Box>

            <DarStatusTracker
                submissionStatus={application.submission_status}
                approvalStatus={}
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
        </Paper>);
}

export { DarFormHeader };