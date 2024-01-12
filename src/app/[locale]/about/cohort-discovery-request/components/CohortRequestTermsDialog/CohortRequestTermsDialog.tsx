"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { InView } from "react-intersection-observer";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { templateRepeatFields } from "@/interfaces/Cms";
import ActiveList from "@/components/ActiveList";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import Form from "@/components/Form";
import HTMLContent from "@/components/HTMLContent";
import InputWrapper from "@/components/InputWrapper";
import ModalButtons from "@/components/ModalButtons";
import ScrollContent from "@/components/ScrollContent";
import useDialog from "@/hooks/useDialog";
import useModal from "@/hooks/useModal";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import {
    cohortAcceptTermsValidationSchema,
    cohortAcceptTermsDefaultValues,
    cohortAcceptTermsField,
} from "@/config/forms/cohortTermsAccept";
import { colors } from "@/config/theme";

const TRANSLATION_PATH_MODAL = "modals.CohortRequestSent";
const TRANSLATION_PATH_DIALOG = "dialogs.CohortRequestTerms";

const CohortRequestTermsDialog = () => {
    const [activeItem, setActiveItem] = useState(1);
    const { push } = useRouter();
    const { control, handleSubmit } = useForm({
        defaultValues: cohortAcceptTermsDefaultValues,
        resolver: yupResolver(cohortAcceptTermsValidationSchema),
    });

    const { hideDialog, store } = useDialog();
    const { dialogProps } = store as unknown as {
        dialogProps: { cmsContent: templateRepeatFields };
    };

    const { showModal } = useModal();

    const t = useTranslations("modules");

    const submitRequest = usePost(apis.cohortRequestsV1Url, {
        successNotificationsOn: false,
    });

    const handleSuccess = () => {
        hideDialog();
        showModal({
            title: t(`${TRANSLATION_PATH_MODAL}.title`),
            content: t(`${TRANSLATION_PATH_MODAL}.text`),
            confirmText: t(`${TRANSLATION_PATH_MODAL}.confirmButton`),
            onSuccess: () => {
                push("/");
            },
        });
    };

    const onFormSubmit = async () => {
        await submitRequest({ details: "required" });
        handleSuccess();
    };

    const handleScroll = (id: number) => {
        const section = document.querySelector(`#anchor${id}`);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <Dialog title="" maxWidth="laptop">
            <Form
                sx={{ p: 0 }}
                component="form"
                onSubmit={handleSubmit(onFormSubmit)}>
                <MuiDialogContent>
                    <Box sx={{ display: "flex", p: 0 }}>
                        <Box
                            sx={{
                                width: 240,
                                pl: 0,
                                borderRight: `1px solid ${colors.grey300}`,
                            }}>
                            <ActiveList
                                handleClick={handleScroll}
                                activeItem={activeItem}
                                items={dialogProps?.cmsContent.contents}
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Box
                                sx={{
                                    p: 0,
                                    mb: 2,
                                    borderBottom: `1px solid ${colors.grey300}`,
                                }}>
                                <Typography
                                    variant="h2"
                                    sx={{ mb: 2, fontSize: 24 }}>
                                    {dialogProps?.cmsContent.title}
                                </Typography>
                                <Typography color="GrayText" sx={{ mb: 2 }}>
                                    {dialogProps?.cmsContent.subTitle}
                                </Typography>
                            </Box>
                            <ScrollContent>
                                <div style={{ marginBottom: 30 }}>
                                    <HTMLContent
                                        content={
                                            dialogProps?.cmsContent.description
                                        }
                                    />
                                </div>
                                {dialogProps?.cmsContent.contents.map(
                                    (term, index) => (
                                        <InView
                                            key={term.label}
                                            id={`anchor${index + 1}`}
                                            as="div"
                                            onChange={inView => {
                                                if (inView) {
                                                    setActiveItem(index + 1);
                                                }
                                            }}>
                                            <Typography
                                                variant="h3"
                                                fontSize={16}
                                                sx={{
                                                    textTransform: "uppercase",
                                                }}>
                                                {index + 1}. {term.label}
                                            </Typography>
                                            <HTMLContent
                                                content={term.content}
                                            />
                                        </InView>
                                    )
                                )}
                            </ScrollContent>
                        </Box>
                    </Box>
                </MuiDialogContent>
                <MuiDialogActions
                    sx={{
                        justifyContent: "space-between",
                        p: 2,
                        borderTop: `1px solid ${colors.grey300}`,
                    }}>
                    <InputWrapper
                        control={control}
                        label={t(`${TRANSLATION_PATH_DIALOG}.acceptTerms`)}
                        {...cohortAcceptTermsField}
                    />
                    <ModalButtons
                        confirmText={t(
                            `${TRANSLATION_PATH_DIALOG}.confirmButton`
                        )}
                        cancelText={t(
                            `${TRANSLATION_PATH_DIALOG}.discardButton`
                        )}
                        confirmType="submit"
                        onSuccess={handleSuccess}
                    />
                </MuiDialogActions>
            </Form>
        </Dialog>
    );
};

export default CohortRequestTermsDialog;
