import * as React from "react";
import MuiDialogContent from "@mui/material/DialogContent";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Dialog from "@/components/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import ModalButtons from "@/components/ModalButtons";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import {
    signUpDefaultValues,
    signUpFormFields,
    signUpValidationSchema,
} from "@/config/forms/signUp";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignUp } from "@/interfaces/SignUp";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import vars from "@/config/vars";

const SignUpDialog = () => {
    const { hideDialog } = useDialog();
    const { t } = useTranslation("modules");

    const signUp = usePost<SignUp>(vars.authUsernameV1Url);

    const { control, handleSubmit, getValues } = useForm<SignUp>({
        resolver: yupResolver(signUpValidationSchema),
        defaultValues: { ...signUpDefaultValues },
    });

    const onFormSubmit = async (data: SignUp) => {
        await signUp(data);
        hideDialog();
    };

    return (
        <Dialog title={t("dialogs.SignUpDialog.title")}>
            <Box
                onSubmit={handleSubmit(onFormSubmit)}
                component="form"
                sx={{
                    p: 0,
                    "& .MuiTextField-root": {
                        m: 1,
                        display: "flex",
                        width: "25ch",
                    },
                }}>
                <MuiDialogContent>
                    {signUpFormFields.map(field => (
                        <InputWrapper
                            getValues={getValues}
                            key={field.name}
                            control={control}
                            {...field}
                        />
                    ))}
                </MuiDialogContent>
                <MuiDialogActions>
                    <ModalButtons
                        confirmText={t("dialogs.SignUpDialog.button") || ""}
                        confirmType="submit"
                    />
                </MuiDialogActions>
            </Box>
        </Dialog>
    );
};

export default SignUpDialog;
