"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import { GetServerSideProps } from "next";
import { SignIn } from "@/interfaces/SignIn";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Container from "@/components/Container";
import InputWrapper from "@/components/InputWrapper";
import useSignIn from "@/hooks/useSignIn";
import {
    signInDefaultValues,
    signInFormFields,
    signInValidationSchema,
} from "@/config/forms/signIn";
import messages from "@/config/messages/en.json";
import { CloseIcon } from "@/consts/icons";

const SignInDialog = () => {
    const signIn = useSignIn();
    const [hasError, setHasError] = useState(false);

    const { control, handleSubmit } = useForm<SignIn>({
        resolver: yupResolver(signInValidationSchema),
        defaultValues: { ...signInDefaultValues },
    });

    const onFormSubmit = async (data: SignIn) => {
        await signIn(data).catch(() => setHasError(true));
    };

    return (
        <Container sx={{ background: "white", padding: 0 }}>
            <Box
                onSubmit={handleSubmit(onFormSubmit)}
                component="form"
                sx={{
                    "& .MuiTextField-root": {
                        m: 1,
                        display: "flex",
                        width: "25ch",
                    },
                }}>
                {signInFormFields.map(field => (
                    <InputWrapper
                        key={field.name}
                        control={control}
                        {...field}
                    />
                ))}
                <Button type="submit">Sign in</Button>
                {hasError && (
                    <Alert
                        icon={<CloseIcon fontSize="inherit" />}
                        severity="error">
                        Incorrect details
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {
            messages,
        },
    };
};

export default SignInDialog;
