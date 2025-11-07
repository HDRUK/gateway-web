"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert } from "@mui/material";
import { useTranslations } from "next-intl";
import { Sector } from "@/interfaces/Sector";
import { User } from "@/interfaces/User";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import apis from "@/config/apis";
import {
    profileDefaultValues,
    profileFormFields,
    profileContactFormFields,
    profileValidationSchemaOpenAthens,
    profileValidationSchema,
    profileFormFieldsOpenAthens,
} from "@/config/forms/profile";
import KeepingUpdated from "../KeepingUpdated";

function isScrambled(email: string) {
    const indicatorsOfScrambled = [
        "member@",
        "staff@",
        "student@",
        "employee@",
        "postgraduatetaught@",
    ];

    return indicatorsOfScrambled.some(item =>
        email.toLowerCase().includes(item)
    );
}

const VerifyButton = ({
    onClick,
    children,
}: {
    onClick: () => void;
    children: React.ReactNode;
}) => (
    <Button
        variant="text"
        onClick={onClick}
        sx={{
            textTransform: "none",
            p: 0,
            minWidth: "auto",
        }}>
        {children}
    </Button>
);
const getRichTextComponents = (onClick: () => void) => ({
    verifyButton: (chunks: React.ReactNode) => (
        <VerifyButton onClick={onClick}>{chunks}</VerifyButton>
    ),
});

const ProfileForm = () => {
    const t = useTranslations("pages.profile");
    const { user } = useAuth();
    const [
        secondaryEmailVerificationRequested,
        setSecondaryEmailVerificationRequested,
    ] = useState(false);

    const isOpenAthens = user?.provider === "open-athens";
    const secondaryEmailVerified = user?.secondary_email_verified_at !== null;
    const hasSecondaryEmail = !!user?.secondary_email;
    const emailIsScrambled =
        user?.provider === "open-athens" && isScrambled(user.email);

    const requestSecondaryVerification = usePost(
        `${apis.usersV1Url}/${user?.id}/resend-secondary-verification`,
        { successNotificationsOn: false }
    );

    const hydratedDefaultValues = useMemo(
        () => ({
            ...profileDefaultValues,
            ...user,
            ...(isOpenAthens &&
                (emailIsScrambled || user?.preferred_email !== "primary") && {
                    preferred_email: "secondary",
                }),
        }),
        [isOpenAthens, user]
    );

    const updateProfile = usePut<User>(apis.usersV1Url, {
        itemName: "Account",
    });

    const triggerSecondaryVerification = () => {
        requestSecondaryVerification(null);
        setSecondaryEmailVerificationRequested(true);
    };

    const { data: sectors = [], isLoading: isSectorLoading } = useGet<Sector[]>(
        apis.sectorsV1Url
    );

    const { setValue, control, handleSubmit, reset, formState, watch } =
        useForm<User>({
            mode: "onTouched",
            resolver: yupResolver(
                !isOpenAthens
                    ? profileValidationSchema
                    : profileValidationSchemaOpenAthens
            ),
            defaultValues: hydratedDefaultValues,
        });

    const secondaryEmail = watch("secondary_email");
    const richTextComponents = useMemo(
        () => getRichTextComponents(triggerSecondaryVerification),
        [triggerSecondaryVerification]
    );

    const [preferredEmailDisabled, setPreferredEmailDisabled] = useState(false);

    const hydratedFormFields = useMemo(
        () =>
            (!isOpenAthens
                ? profileFormFields
                : profileFormFieldsOpenAthens
            ).map(field => {
                if (field.name === "sector_id") {
                    return {
                        ...field,
                        options: sectors.map(sector => ({
                            value: sector.id,
                            label: sector.name,
                        })),
                    };
                }
                if (field.name === "preferred_email") {
                    return {
                        ...field,
                        disabled:
                            (!isOpenAthens && !secondaryEmail) ||
                            (isOpenAthens && emailIsScrambled) ||
                            !secondaryEmailVerified ||
                            preferredEmailDisabled,
                    };
                }
                if (field.name === "secondary_email") {
                    return {
                        ...field,
                        disabled: isOpenAthens && !!user?.secondary_email,
                    };
                }
                return field;
            }),
        [
            isOpenAthens,
            emailIsScrambled,
            sectors,
            secondaryEmail,
            user?.secondary_email,
            preferredEmailDisabled,
        ]
    );

    // Disable
    useEffect(() => {
        if (
            isOpenAthens &&
            (emailIsScrambled || user?.preferred_email !== "primary")
        ) {
            setValue("preferred_email", "secondary");
        } else if (!secondaryEmail) {
            setValue("preferred_email", "primary");
        }
    }, [isOpenAthens, secondaryEmail, setValue, user, emailIsScrambled]);
    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty,
        modalProps: {
            content: t("unsavedChangesWarning"),
        },
    });

    const submitForm = (formData: User) => {
        if (!user) return;
        if (user.secondary_email !== secondaryEmail) {
            setSecondaryEmailVerificationRequested(true);
        }
        const payload = { ...user, ...formData };
        updateProfile(payload.id, payload);
    };

    useEffect(() => {
        if (!user) return;
        reset(hydratedDefaultValues);
    }, [isOpenAthens, hydratedDefaultValues, reset, user]);

    // If the user changes their secondary email it becomes unverified
    // We don't want them top be able to select it as their preferred notification
    useEffect(() => {
        if (secondaryEmail !== user?.secondary_email) {
            setPreferredEmailDisabled(true);
            setValue("preferred_email", "primary");
        } else {
            setPreferredEmailDisabled(false);
        }
    }, [secondaryEmail, user]);

    if (isSectorLoading) return <Loading />;

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
            {hydratedFormFields.map(field => {
                const isSecondaryEmail = field.name === "secondary_email";

                return (
                    <React.Fragment key={field.name}>
                        <InputWrapper control={control} {...field} />

                        {isSecondaryEmail &&
                            secondaryEmailVerificationRequested && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {t("verificationSent")}
                                </Alert>
                            )}

                        {isSecondaryEmail &&
                            hasSecondaryEmail &&
                            !secondaryEmailVerified &&
                            !secondaryEmailVerificationRequested && (
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    {t.rich("unverified", richTextComponents)}
                                </Alert>
                            )}
                    </React.Fragment>
                );
            })}

            <KeepingUpdated
                fields={profileContactFormFields}
                control={control}
            />

            <Box sx={{ p: 0, display: "flex", justifyContent: "end" }}>
                <Button type="submit">{t("saveChanges")}</Button>
            </Box>
        </Form>
    );
};

export default ProfileForm;
