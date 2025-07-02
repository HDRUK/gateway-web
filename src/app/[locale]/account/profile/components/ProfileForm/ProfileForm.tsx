import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert } from "@mui/material";
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

const ProfileForm = () => {
    const { user } = useAuth();
    const [
        secondaryEmailVerificationRequested,
        setSecondaryEmailVerificationRequested,
    ] = useState(false);

    const isOpenAthens = user?.provider === "open-athens";
    const secondaryEmailVerified = user?.secondary_email_verified_at !== null;

    const requestSecondaryVerfication = usePost(
        `${apis.usersV1Url}/${user?.id}/resend-secondary-verification`,
        {
            successNotificationsOn: false,
        }
    );

    const hydratedDefaultValues = useMemo(() => {
        return {
            ...profileDefaultValues,
            ...user,
            ...(isOpenAthens && { preferred_email: "secondary" }),
        };
    }, [isOpenAthens, user]);

    const updateProfile = usePut<User>(apis.usersV1Url, {
        itemName: "Account",
    });

    const triggerSecondaryVerification = () => {
        requestSecondaryVerfication(null);
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

    const hydratedFormFields = useMemo(
        () =>
            (!isOpenAthens
                ? profileFormFields
                : profileFormFieldsOpenAthens
            ).map(field => {
                if (field.name === "sector_id") {
                    return {
                        ...field,
                        options: sectors?.map(sector => ({
                            value: sector.id,
                            label: sector.name,
                        })),
                    };
                }
                if (field.name === "preferred_email") {
                    return {
                        ...field,
                        disabled:
                            (!isOpenAthens && !secondaryEmail) || isOpenAthens,
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
        [isOpenAthens, sectors, secondaryEmail, user?.secondary_email]
    );

    useEffect(() => {
        if (isOpenAthens) {
            setValue("preferred_email", "secondary");
        } else if (!secondaryEmail) {
            setValue("preferred_email", "primary");
        }
    }, [isOpenAthens, secondaryEmail, setValue]);

    useUnsavedChanges({
        shouldConfirmLeave: formState.isDirty,
        modalProps: {
            content:
                "Changes to your profile account are not automatically saved.",
        },
    });

    const submitForm = (formData: User) => {
        if (!user) return;
        const payload = { ...user, ...formData };
        updateProfile(payload.id, payload);
    };

    useEffect(() => {
        if (!user) return;
        reset(hydratedDefaultValues);
    }, [isOpenAthens, hydratedDefaultValues, reset, user]);

    if (isSectorLoading) return <Loading />;

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
            {hydratedFormFields.map(field => (
                <React.Fragment key={field.name}>
                    <InputWrapper control={control} {...field} />
                    {field.name === "secondary_email" &&
                        !secondaryEmailVerified &&
                        (!secondaryEmailVerificationRequested ? (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                Your secondary email is unverified. If you have
                                not already received a verification email,
                                please{" "}
                                <Button
                                    variant="text"
                                    onClick={triggerSecondaryVerification}
                                    sx={{
                                        textTransform: "none",
                                        p: 0,
                                        minWidth: "auto",
                                    }}>
                                    click here
                                </Button>{" "}
                                to trigger a new one.
                            </Alert>
                        ) : (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Email Verification Sent!
                            </Alert>
                        ))}
                </React.Fragment>
            ))}

            <KeepingUpdated
                fields={profileContactFormFields}
                control={control}
            />

            <Box sx={{ p: 0, display: "flex", justifyContent: "end" }}>
                <Button type="submit">Save changes</Button>
            </Box>
        </Form>
    );
};

export default ProfileForm;
