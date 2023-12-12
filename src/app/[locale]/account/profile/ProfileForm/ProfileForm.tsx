import Box from "@/components/Box";
import Form from "@/components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@/components/Button";
import {
    profileDefaultValues,
    profileFormFields,
    profileContactFormFields,
    profileValidationSchema,
} from "@/config/forms/profile";
import InputWrapper from "@/components/InputWrapper";
import useGet from "@/hooks/useGet";
import { useEffect, useMemo } from "react";
import { Sector } from "@/interfaces/Sector";
import usePut from "@/hooks/usePut";
import { User } from "@/interfaces/User";
import KeepingUpdated from "./KeepingUpdated";
import Loading from "@/components/Loading";
import apis from "@/config/apis";
import useAuth from "@/hooks/useAuth";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

const ProfileForm = () => {
    const { user } = useAuth();
    const updateProfile = usePut<User>(apis.usersV1Url, {
        itemName: "Account",
    });
    const { data: sectors = [], isLoading: isSectorLoading } = useGet<Sector[]>(
        apis.sectorsV1Url
    );

    const { setValue, control, handleSubmit, reset, formState, watch } =
        useForm<User>({
            mode: "onTouched",
            resolver: yupResolver(profileValidationSchema),
            defaultValues: {
                ...profileDefaultValues,
                ...user,
            },
        });

    const secondaryEmail = watch("secondary_email");

    const hydratedFormFields = useMemo(
        () =>
            profileFormFields.map(field => {
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
                        disabled: !secondaryEmail,
                    };
                }
                return field;
            }),
        [sectors, secondaryEmail]
    );

    useEffect(() => {
        if (!secondaryEmail) {
            setValue("preferred_email", "primary");
        }
    }, [secondaryEmail, setValue]);

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
        if (!user) {
            return;
        }
        reset({ ...profileDefaultValues, ...user });
    }, [reset, user]);

    if (isSectorLoading) return <Loading />;

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
            {hydratedFormFields.map(field => (
                <InputWrapper key={field.name} control={control} {...field} />
            ))}

            <KeepingUpdated
                fields={profileContactFormFields}
                control={control}
            />
            <Box
                sx={{
                    p: 0,
                    display: "flex",
                    justifyContent: "end",
                }}>
                <Button type="submit">Save changes</Button>
            </Box>
        </Form>
    );
};

export default ProfileForm;
