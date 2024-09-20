"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import InputWrapper from "@/components/InputWrapper";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import config from "@/config/config";
import { inputComponents } from "@/config/forms";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = "modules.dialogs.AddPublicationDialog";

interface AddPublicationDialogProps {
    teamId?: number;
}

const DOI_REGEX = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
const VALIDATION_SCHEMA = yup
    .object({
        query: yup.string().matches(DOI_REGEX, "Enter a valid DOI"),
    })
    .required();

const AddPublicationDialog = ({ teamId }: AddPublicationDialogProps) => {
    const router = useRouter();
    const { hideDialog } = useDialog();
    const t = useTranslations(TRANSLATION_PATH);

    const [loading, setLoading] = useState<boolean>();

    const PUBLICATION_ROUTE = teamId
        ? `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.PUBLICATIONS}/${RouteName.CREATE}`
        : `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.PUBLICATIONS}/${RouteName.CREATE}`;

    const handleManual = () => {
        hideDialog();
        router.push(PUBLICATION_ROUTE);
    };

    const {
        control,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
        resolver: yupResolver(VALIDATION_SCHEMA),
        defaultValues: {
            query: "",
        },
    });

    const queryValue = watch("query");

    const searchRequest = usePost(apis.doiSearchV1Url, {
        successNotificationsOn: false,
    });

    const performSearch = async () => {
        setLoading(true);
        await searchRequest({ query: queryValue }).then(res => {
            if (res) {
                localStorage.setItem(
                    config.PUBLICATION_LOCAL_STORAGE,
                    JSON.stringify({ ...res, doi: queryValue })
                );
                router.push(PUBLICATION_ROUTE);
                hideDialog();
            } else {
                notificationService.apiError(t("notFound"));
                setLoading(false);
            }
        });
    };

    return (
        <Dialog title="">
            <MuiDialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    mt: 3,
                    justifyContent: "center",
                }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        pb: 1,
                        gap: 1,
                    }}>
                    <InputWrapper
                        label="DOI Search"
                        component={inputComponents.TextField}
                        control={control}
                        name="query"
                        placeholder={t("doiPlaceholder")}
                        disabled={loading}
                        formControlSx={{
                            mt: 0,
                            mb: 0,
                            p: 0,
                            flexGrow: 1,
                            "& label": { display: "none" },
                        }}
                        sx={{ p: 0, mt: 0 }}
                    />
                    <Button
                        onClick={performSearch}
                        disabled={!queryValue || loading || !isEmpty(errors)}>
                        {t("searchText")}
                    </Button>
                </Box>

                <Typography fontWeight={500} sx={{ alignSelf: "center" }}>
                    {t("or")}
                </Typography>

                <MuiDialogActions sx={{ alignSelf: "center" }}>
                    <Button
                        onClick={handleManual}
                        variant="outlined"
                        color="secondary">
                        {t("manualButton")}
                    </Button>
                </MuiDialogActions>
            </MuiDialogContent>
        </Dialog>
    );
};

export default AddPublicationDialog;
