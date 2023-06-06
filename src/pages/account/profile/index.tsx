import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Form from "@/components/Form";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "@/components/Button";
import {
    ProfileFormData,
    profileDefaultValues,
    profileFormFields,
    profileValidationSchema,
} from "@/config/forms/profile";
import InputWrapper from "@/components/InputWrapper";

const Profile = () => {
    const { control, handleSubmit } = useForm<ProfileFormData>({
        resolver: yupResolver(profileValidationSchema),
        defaultValues: profileDefaultValues,
    });

    const submitForm = data => {
        console.log("data: ", data);
    };

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
                    <Form onSubmit={handleSubmit(submitForm)}>
                        {profileFormFields.map(field => (
                            <InputWrapper
                                key={field.name}
                                control={control}
                                {...field}
                            />
                        ))}
                        <Button type="submit">Save changes</Button>
                    </Form>
                </Box>
            </BoxContainer>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
            isProtected: true,
        },
    };
};

export default Profile;
