"use client";

import * as React from "react";

import Container from "@/components/Container";
import { useForm } from "react-hook-form";
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
import Button from "@/components/Button";
import { GetServerSideProps } from "next";
import messages from "@/config/messages/en.json";

const SignInDialog = () => {
    const signIn = useSignIn();

    const { control, handleSubmit } = useForm<SignIn>({
        resolver: yupResolver(signInValidationSchema),
        defaultValues: { ...signInDefaultValues },
    });

    const onFormSubmit = async (data: SignIn) => {
        await signIn(data);
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
