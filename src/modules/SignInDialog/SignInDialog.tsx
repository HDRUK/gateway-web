import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { SignIn } from "@/interfaces/SignIn";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import InputWrapper from "@/components/InputWrapper";
import ModalButtons from "@/components/ModalButtons";
import useSignIn from "@/hooks/useSignIn";
import {
    signInDefaultValues,
    signInFormFields,
    signInValidationSchema,
} from "@/config/forms/signIn";

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
                        <InputWrapper
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
