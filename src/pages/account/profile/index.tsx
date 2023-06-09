import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Form from "@/components/Form";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import jwtDecode from "jwt-decode";

import Button from "@/components/Button";
import {
    profileDefaultValues,
    profileFormFields,
    profileValidationSchema,
} from "@/config/forms/profile";
import InputWrapper from "@/components/InputWrapper";
import useGet from "@/hooks/useGet";
import config from "@/config";
import { useMemo } from "react";
import { Sector } from "@/interfaces/Sector";
import usePut from "@/hooks/usePut";
import { User } from "@/interfaces/User";
import KeepingUpdated from "@/modules/profile/KeepingUpdated";

interface ProfileProps {
    user: User;
}

const Profile = ({ user }: ProfileProps) => {
    const { data: sectors = [] } = useGet<Sector[]>(config.sectorsV1Url);
    const updateProfile = usePut<User>(config.usersV1Url);

    const { control, handleSubmit, getValues } = useForm<User>({
        resolver: yupResolver(profileValidationSchema),
        defaultValues: { ...profileDefaultValues, ...user },
    });

    const submitForm = (formData: User) => {
        updateProfile({ ...user, ...formData });
    };

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

    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My account - Profile" />
            <BoxContainer
                sx={{
                    gridTemplateColumns: {
                        mobile: "repeat(1, 1fr)",
                        tablet: "repeat(5, 1fr)",
                    },
                    gap: {
                        mobile: 0,
                        tablet: 1,
                    },
                }}>
                <Box
                    sx={{ gridColumn: { tablet: "span 2", laptop: "span 1" } }}>
                    <h2>Menu</h2>
                </Box>
                <Box
                    sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                    <h2 style={{ marginBottom: "10px" }}>Your profile</h2>
                    <p>
                        You can control what appears on your profile using the
                        icons. Your details are also used when you make a data
                        access request application.
                    </p>
                    <Form
                        sx={{ maxWidth: 1000 }}
                        onSubmit={handleSubmit(submitForm)}>
                        {hydratedFormFields.map(field => (
                            <InputWrapper
                                getValues={getValues}
                                key={field.name}
                                control={control}
                                {...field}
                            />
                        ))}

                        <KeepingUpdated control={control} />
                        <Box
                            sx={{
                                p: 0,
                                display: "flex",
                                justifyContent: "end",
                            }}>
                            <Button type="submit">Save changes</Button>
                        </Box>
                    </Form>
                </Box>
            </BoxContainer>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    req,
    locale,
}) => {
    const jwt = req.cookies.token;
    const { user } = jwtDecode(jwt);
    return {
        props: {
            user,
            ...(await loadServerSideLocales(locale)),
            isProtected: true,
        },
    };
};

export default Profile;
