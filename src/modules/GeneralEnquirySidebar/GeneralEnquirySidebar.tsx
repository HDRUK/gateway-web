"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { DatasetEnquiry, Enquiry } from "@/interfaces/Enquiry";
import { User } from "@/interfaces/User";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import useAuth from "@/hooks/useAuth";
import usePost from "@/hooks/usePost";
import useSidebar from "@/hooks/useSidebar";
import apis from "@/config/apis";
import {
    generalEnquiryFormFields,
    generalEnquiryValidationSchema,
    generalEnquiryDefaultValues,
} from "@/config/forms/generalEnquiry";
import { getPreferredEmail } from "@/utils/user";

const TRANSLATION_PATH = "pages.search.components.GeneralEnquiryForm";

const GeneralEnquirySidebar = ({
    datasets,
}: {
    datasets: DatasetEnquiry[];
}) => {
    const { hideSidebar } = useSidebar();

    const t = useTranslations(TRANSLATION_PATH);

    const { user } = useAuth();

    const sendEnquiry = usePost<Enquiry>(apis.enquiryThreadsV1Url, {
        itemName: "Enquiry item",
    });

    const { control, handleSubmit, reset } = useForm<User>({
        mode: "onTouched",
        resolver: yupResolver(generalEnquiryValidationSchema),
        defaultValues: {
            ...generalEnquiryDefaultValues,
            ...user,
        },
    });

    const hydratedFormFields = generalEnquiryFormFields;

    const organisationField = hydratedFormFields.find(item => item.name === 'organisation')
    if (organisationField){
        organisationField.readOnly = !!user?.organisation
    }

    const submitForm = async (formData: Enquiry) => {
        if (!user) return;
        const minUser = { id: user.id };

        const payload = {
            ...minUser,
            ...formData,
            project_title: "",
            contact_number: formData.contact_number || "", // If not provided, formData.contact_number is null, but we need a string
            datasets: datasets.map(item => ({
                dataset_id: item.datasetId,
                team_id: item.teamId,
                interest_type: "PRIMARY",
            })),
            from: getPreferredEmail(user),
            is_dar_dialogue: false,
            is_dar_status: false,
            is_feasibility_enquiry: false,
            is_general_enquiry: true,
        };

        await sendEnquiry(payload).then(res => {
            if (res) {
                hideSidebar();
            }
        });
    };

    useEffect(() => {
        if (!user) {
            return;
        }
        reset({ ...generalEnquiryDefaultValues, ...user });
    }, [reset, user]);

    return (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    tablet: "repeat(4, 1fr)",
                },
                gap: {
                    mobile: 1,
                    tablet: 2,
                },
                p: 0,
            }}>
            <Box
                sx={{
                    gridColumn: {
                        tablet: "span 4",
                        laptop: "span 4",
                    },
                }}>
                {datasets.map(item => (
                    <Typography variant="h1">
                        {item.teamMemberOf} {">"} {item.teamName}
                    </Typography>
                ))}
                <Typography>{t("helperText")}</Typography>

                <Form sx={{ mt: 3 }} onSubmit={handleSubmit(submitForm)}>
                    {hydratedFormFields.map(field => (
                        <InputWrapper
                            key={field.name}
                            control={control}
                            {...field}
                        />
                    ))}

                    <Box
                        sx={{
                            p: 0,
                            display: "flex",
                            justifyContent: "end",
                            pb: 7,
                        }}>
                        <Button type="submit">{t("saveButton")}</Button>
                    </Box>
                </Form>
            </Box>
        </BoxContainer>
    );
};

export default GeneralEnquirySidebar;
