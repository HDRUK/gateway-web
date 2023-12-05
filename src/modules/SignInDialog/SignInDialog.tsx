import * as React from "react";
import MuiDialogContent from "@mui/material/DialogContent";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import Dialog from "@/components/Dialog";
import MuiDialogActions from "@mui/material/DialogActions";
import ModalButtons from "@/components/ModalButtons";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import {
    signInDefaultValues,
    signInFormFields,
    signInValidationSchema,
} from "@/config/forms/signIn";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignIn } from "@/interfaces/SignIn";
import useSignIn from "@/hooks/useSignIn";

const SignInDialog = () => {
    const t = useTranslations("modules");
    const signIn = useSignIn();

    const { control, handleSubmit } = useForm<SignIn>({
        resolver: yupResolver(signInValidationSchema),
        defaultValues: { ...signInDefaultValues },
    });

    const onFormSubmit = async (data: SignIn) => {
        await signIn(data);
    };

    return (
        <Dialog title={t("dialogs.SignInDialog.title")}>
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
                    {signInFormFields.map(field => (
                        <InputWrapper<SignIn>
                            key={field.name}
                            control={control}
                            {...field}
                        />
                    ))}
                </MuiDialogContent>
                <MuiDialogActions>
                    <ModalButtons
                        confirmText={t("dialogs.SignInDialog.button") || ""}
                        confirmType="submit"
                    />
                </MuiDialogActions>
            </Box>
        </Dialog>
    );
};

export default SignInDialog;
