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
import KeepingUpdated from "@/modules/profile/KeepingUpdated";
import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import vars from "@/config/vars";

const ProfileForm = () => {
    const { user } = useAuth();
    const { data: profile, isLoading: isUserLoading } = useGet<User>(
        `${vars.usersV1Url}/${user?.id}`
    );
    const updateProfile = usePut<User>(`${vars.usersV1Url}/${user?.id}`, {
        itemName: "Profile",
    });
    const { data: sectors = [], isLoading: isSectorLoading } = useGet<Sector[]>(
        vars.sectorsV1Url
    );

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
                return field;
            }),
        [sectors]
    );

    const { control, handleSubmit, getValues, reset } = useForm<User>({
        resolver: yupResolver(profileValidationSchema),
        defaultValues: { ...profileDefaultValues, ...profile },
    });

    const submitForm = (formData: User) => {
        updateProfile({ ...profile, ...formData });
    };

    useEffect(() => {
        if (!profile) {
            return;
        }
        reset(profile);
    }, [reset, profile]);

    if (isUserLoading || isSectorLoading) return <Loading />;

    return (
        <Form sx={{ maxWidth: 1000 }} onSubmit={handleSubmit(submitForm)}>
            {hydratedFormFields.map(field => (
                <InputWrapper
                    getValues={getValues}
                    key={field.name}
                    control={control}
                    {...field}
                />
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
