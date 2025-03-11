"use client";

import { useForm } from "react-hook-form";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Typography from "@/components/Typography";
import usePatch from "@/hooks/usePatch";
import { inputComponents } from "@/config/forms";
import { colors } from "@/config/theme";
import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";

enum CommentType {
    DRAFT = "draftComment",
    APPROVE = "approvedComment",
    REJECT = "rejectedComment",
}

type StatusSection = {
    name: CommentType;
    description: string;
    buttonText: string;
    status: DarApplicationStatus | DarApplicationApprovalStatus;
    comment: string;
};

interface ManageForm {
    draftComment: string;
    approvedComment: string;
    rejectedComment: string;
}

interface DarManageDialogProps {
    darApplicationEndpoint: string;
    applicationId: string;
}

const TRANSLATION_PATH = "modules.dialogs.DarManageDialog";

const DarManageDialog = ({
    darApplicationEndpoint,
    applicationId,
}: DarManageDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const { control, watch } = useForm<ManageForm>({
        defaultValues: {
            [CommentType.DRAFT]: "",
            [CommentType.APPROVE]: "",
            [CommentType.REJECT]: "",
        },
    });

    const draftComment = watch(CommentType.DRAFT);
    const approvedComment = watch(CommentType.APPROVE);
    const rejectedComment = watch(CommentType.REJECT);

    const updateApplication = usePatch(darApplicationEndpoint, {
        itemName: t("darRequest"),
    });

    const handleSetStatus = (
        comment: string,
        status: DarApplicationStatus | DarApplicationApprovalStatus
    ) => {
        const statusKey =
            status === DarApplicationStatus.DRAFT
                ? "submission_status"
                : "approval_status";

        let applicationStatus = status;

        if (comment && status === DarApplicationApprovalStatus.APPROVED) {
            applicationStatus = DarApplicationApprovalStatus.APPROVED_COMMENTS;
        }

        updateApplication(applicationId, {
            comment: comment,
            [statusKey]: applicationStatus,
        });
    };

    const statusSection: StatusSection[] = [
        {
            name: CommentType.DRAFT,
            description: t("draftDesc"),
            buttonText: t("draftButtonText"),
            status: DarApplicationStatus.DRAFT,
            comment: draftComment,
        },
        {
            name: CommentType.APPROVE,
            description: t("approvedDesc"),
            buttonText: t("approvedButtonText"),
            status: DarApplicationApprovalStatus.APPROVED,
            comment: approvedComment,
        },
        {
            name: CommentType.REJECT,
            description: t("rejectedDesc"),
            buttonText: t("rejectedButtonText"),
            status: DarApplicationApprovalStatus.REJECTED,
            comment: rejectedComment,
        },
    ];

    return (
        <Dialog title={t("changeStatus")}>
            <MuiDialogContent>
                <Typography sx={{ mb: 2 }}>{t("intro")}</Typography>

                <BoxContainer sx={{ gap: 0, m: 0, p: 0 }}>
                    <Form>
                        {statusSection.map(section => (
                            <Box
                                sx={{
                                    backgroundColor: colors.grey100,
                                    p: 4,
                                    pb: 2,
                                }}>
                                <Typography
                                    fontSize={20}
                                    color={colors.purple700}
                                    fontWeight={600}>
                                    {section.description}
                                </Typography>
                                <InputWrapper
                                    component={inputComponents.TextArea}
                                    control={control}
                                    name={section.name}
                                    sx={{ backgroundColor: "white" }}
                                />
                                <Button
                                    onClick={() =>
                                        handleSetStatus(
                                            section.comment,
                                            section.status
                                        )
                                    }>
                                    {section.buttonText}
                                </Button>
                            </Box>
                        ))}
                    </Form>
                </BoxContainer>
            </MuiDialogContent>
        </Dialog>
    );
};

export default DarManageDialog;
