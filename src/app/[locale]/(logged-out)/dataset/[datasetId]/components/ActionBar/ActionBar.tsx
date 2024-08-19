"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { FileExport } from "@/interfaces/FileExport";
import { User } from "@/interfaces/User";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import useSidebar from "@/hooks/useSidebar";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import {
    generalEnquiryFormFields,
    generalEnquiryValidationSchema,
    generalEnquiryDefaultValues,
} from "@/config/forms/generalEnquiry";
import { DownloadIcon } from "@/consts/icons";
import { downloadFile } from "@/utils/download";
import { ActionBarWrapper } from "./ActionBar.styles";

const TRANSLATION_PATH = "pages.dataset.components.ActionBar";

const ActionBar = ({
    teamName,
    teamMemberOf,
}: {
    teamName: string;
    teamMemberOf: string;
}) => {
    const params = useParams<{
        datasetId: string;
    }>();

    const { isLoggedIn, user } = useAuth();
    const { showDialog } = useDialog();

    const [isDownloading, setIsDownloading] = useState(false);

    const t = useTranslations(TRANSLATION_PATH);

    const { data: datasetCsv } = useGet<{
        content: string;
        filename: string;
        type: string;
    }>(`${apis.datasetsExportV1Url}/?dataset_id=${params?.datasetId}`, {
        shouldFetch: !isDownloading,
    });

    const handleDownload = async () => {
        const csvData = {
            ...datasetCsv,
            filename: `dataset_${params?.datasetId}.csv`,
        };

        if (csvData) {
            notificationService.apiSuccess(t("downloadStarted"));
            downloadFile(csvData as FileExport);
        }
    };

    const downloadDataset = async () => {
        setIsDownloading(true);
        await handleDownload();
        setIsDownloading(false);
    };

    const { showSidebar } = useSidebar();

    const { control, handleSubmit, reset } = useForm<User>({
        mode: "onTouched",
        resolver: yupResolver(generalEnquiryValidationSchema),
        defaultValues: {
            ...generalEnquiryDefaultValues,
            ...user,
        },
    });

    const hydratedFormFields = generalEnquiryFormFields;
    // useMemo(
    //     () =>
    //         generalEnquiryFormFields.map(field => {
    //             console.log(field);
    //             return field;
    //         }),
    //     [user, generalEnquiryFormFields]
    // );

    const submitForm = (formData: User) => {
        console.log("SUBMIT GENERAL ENQURIY", formData);
    };

    useEffect(() => {
        if (!user) {
            return;
        }
        reset({ ...generalEnquiryDefaultValues, ...user });
    }, [reset, user]);

    return (
        <ActionBarWrapper>
            <BackButton label={t("label")} style={{ margin: 0 }} />

            <Box sx={{ display: "flex", gap: 1, p: 0 }}>
                <Button
                    onClick={() => {
                        if (!isLoggedIn) {
                            showDialog(ProvidersDialog, {
                                isProvidersDialog: true,
                            });
                        } else {
                            showSidebar({
                                title: "Messages",
                                content: (
                                    <>
                                        <BoxContainer
                                            sx={{
                                                gridTemplateColumns: {
                                                    tablet: "repeat(4, 1fr)",
                                                },
                                                gap: {
                                                    mobile: 1,
                                                    tablet: 2,
                                                },
                                                p: 0,
                                            }}>
                                            <Box
                                                sx={{
                                                    gridColumn: {
                                                        tablet: "span 4",
                                                        laptop: "span 4",
                                                    },
                                                }}>
                                                <Typography variant="h1">
                                                    {teamMemberOf} {">"}{" "}
                                                    {teamName}
                                                </Typography>
                                                <Typography>
                                                    Send a general enquiry to
                                                    one or multiple Data
                                                    Custodians. You will receive
                                                    an email copy of the enquiry
                                                    sent. The Data Custodian(s)
                                                    will reply via email to your
                                                    preferred email address,
                                                    with a copy shared with the
                                                    Gateway.
                                                </Typography>

                                                <Form
                                                    sx={{ mt: 3 }}
                                                    onSubmit={handleSubmit(
                                                        submitForm
                                                    )}>
                                                    {hydratedFormFields.map(
                                                        field => (
                                                            <InputWrapper
                                                                key={field.name}
                                                                control={
                                                                    control
                                                                }
                                                                {...field}
                                                            />
                                                        )
                                                    )}

                                                    <Box
                                                        sx={{
                                                            p: 0,
                                                            display: "flex",
                                                            justifyContent:
                                                                "end",
                                                        }}>
                                                        <Button type="submit">
                                                            Save changes
                                                        </Button>
                                                    </Box>
                                                </Form>
                                            </Box>
                                        </BoxContainer>
                                    </>
                                ),
                            });
                        }
                    }}>
                    {t("contact")}
                </Button>

                <Button variant="outlined" color="secondary" disabled>
                    {t("submitApplication")}
                </Button>

                <Button
                    variant="text"
                    startIcon={<DownloadIcon />}
                    disabled={isDownloading}
                    onClick={() => !isDownloading && downloadDataset()}>
                    {t("downloadMetadata")}
                </Button>
            </Box>
        </ActionBarWrapper>
    );
};

export default ActionBar;
