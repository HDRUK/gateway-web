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
import config from "@/config";
import { useEffect, useMemo } from "react";
import { Sector } from "@/interfaces/Sector";
import usePut from "@/hooks/usePut";
import { User } from "@/interfaces/User";
import KeepingUpdated from "@/modules/profile/KeepingUpdated";
import useUser from "@/hooks/useUser";

const ProfileForm = () => {
    const { user } = useUser();
    const { data: profile } = useGet<User>(`${config.usersV1Url}/${user.id}`);
    const { data: sectors = [], isLoading } = useGet<Sector[]>(
        config.sectorsV1Url
    );
    const updateProfile = usePut<User>(config.usersV1Url, {
        itemName: "Profile",
    });

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
            return; // loading
        }
        reset(profile);
    }, [reset, profile]);

    if (isLoading) return <div>dsfdsf</div>;

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
