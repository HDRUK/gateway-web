"use client";

import { useForm } from "react-hook-form";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Typography from "@/components/Typography";
import useModal from "@/hooks/useModal";
import { inputComponents } from "@/config/forms";
import { colors } from "@/config/theme";
import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";
import { RouteName } from "@/consts/routeName";
import { updateDarApplicationTeamAction } from "@/app/actions/updateDarApplicationTeam";

enum CommentType {
    DRAFT = "draftComment",
    APPROVE = "approvedComment",
    REJECT = "rejectedComment",
}

type StatusSection = {
    name: CommentType;
    description: string;
    label: string;
    buttonText: string;
    payload: object;
    redirectUrl: string;
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

const DarManageDialog = ({ applicationId }: DarManageDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideModal } = useModal();
    const { push } = useRouter();

    const params = useParams<{ teamId: string }>();

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

    const PATH_REDIRECT = `/${RouteName.ACCOUNT}/${
        RouteName.TEAM
    }/${params?.teamId!}/${RouteName.DATA_ACCESS_REQUESTS}/${
        RouteName.APPLICATIONS
    }`;

    const handleSetStatus = async (payload: any, redirectUrl: string) => {
        const updateResponse = await updateDarApplicationTeamAction(
            applicationId,
            params?.teamId!,
            payload
        );

        hideModal();

        if (updateResponse) {
            push(redirectUrl);
        }
    };

    const statusSection: StatusSection[] = [
        {
            name: CommentType.DRAFT,
            description: t("draftDesc"),
            label: t("draftInfo"),
            buttonText: t("draftButtonText"),
            payload: {
                approval_status: null,
                submission_status: DarApplicationStatus.DRAFT,
                ...(draftComment && { draftComment }),
            },
            redirectUrl: PATH_REDIRECT,
        },
        {
            name: CommentType.APPROVE,
            description: t("approvedDesc"),
            label: t("approvedInfo"),
            buttonText: t("approvedButtonText"),
            payload: {
                approval_status: approvedComment
                    ? DarApplicationApprovalStatus.APPROVED_COMMENTS
                    : DarApplicationApprovalStatus.APPROVED,
                ...(approvedComment && { approvedComment }),
            },
            redirectUrl: `${PATH_REDIRECT}?status=${DarApplicationApprovalStatus.APPROVED}`,
        },
        {
            name: CommentType.REJECT,
            description: t("rejectedDesc"),
            label: t("rejectedInfo"),
            buttonText: t("rejectedButtonText"),
            payload: {
                approval_status: DarApplicationApprovalStatus.REJECTED,
                ...(rejectedComment && { rejectedComment }),
            },
            redirectUrl: `${PATH_REDIRECT}?status=${DarApplicationApprovalStatus.REJECTED}`,
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
                                }}
                                key={section.name}>
                                <Typography
                                    fontSize={20}
                                    color={colors.purple700}
                                    fontWeight={600}
                                    sx={{ mb: 1 }}>
                                    {section.description}
                                </Typography>
                                <InputWrapper
                                    component={inputComponents.TextArea}
                                    control={control}
                                    name={section.name}
                                    sx={{ backgroundColor: "white" }}
                                    label={section.label}
                                />
                                <Button
                                    onClick={() =>
                                        handleSetStatus(
                                            section.payload,
                                            section.redirectUrl
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
