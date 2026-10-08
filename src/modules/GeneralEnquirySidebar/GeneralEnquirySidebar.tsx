"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import {
    DatasetEnquiry,
    GeneralEnquiryFormValues,
    GeneralEnquiryPayload,
} from "@/interfaces/Enquiry";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import { Button } from "@hdruk/ui";
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
import { getEmails } from "@/utils/user";

const TRANSLATION_PATH = "pages.search.components.GeneralEnquiryForm";

const GeneralEnquirySidebar = ({
    datasets,
}: {
    datasets: DatasetEnquiry[];
}) => {
    const { hideSidebar } = useSidebar();

    const t = useTranslations(TRANSLATION_PATH);

    const { user } = useAuth();

    const sendEnquiry = usePost<GeneralEnquiryPayload>(
        apis.enquiryThreadsV1Url,
        {
            itemName: "Enquiry item",
        }
    );

    const emailValues = user ? getEmails(user) : [""];

    const defaultEmailValue = emailValues[0];

    const { control, handleSubmit, reset } = useForm<GeneralEnquiryFormValues>({
        mode: "onTouched",
        resolver: yupResolver(generalEnquiryValidationSchema),
        defaultValues: {
            ...generalEnquiryDefaultValues,
            name: user?.name ?? "",
            organisation: user?.organisation ?? "",
            from: defaultEmailValue,
        },
    });

    const hydratedFormFields = generalEnquiryFormFields.map(field => {
        if (field.name === "from") {
            return {
                ...field,
                options: emailValues.map(email => ({
                    value: email,
                    label: email,
                })),
            };
        }

        return field;
    });

    const organisationField = hydratedFormFields.find(
        item => item.name === "organisation"
    );
    if (organisationField) {
        organisationField.readOnly = !!user?.organisation;

        if (!organisationField.readOnly) {
            organisationField.info = "";
        }
    }

    const submitForm = async (formData: GeneralEnquiryFormValues) => {
        if (!user) {
            return;
        }
        const { from, organisation, contact_number, query } = formData;

        const payload: GeneralEnquiryPayload = {
            from,
            organisation,
            query,
            project_title: "",
            contact_number: contact_number || "",
            datasets: datasets.map(item => ({
                dataset_id: item.datasetId,
                team_id: item.teamId,
                interest_type: "PRIMARY",
            })),
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
        reset({
            ...generalEnquiryDefaultValues,
            name: user.name,
            organisation: user.organisation,
            from: defaultEmailValue,
        });
    }, [reset, user]);

    return (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    sm: "repeat(4, 1fr)",
                },
                gap: {
                    xs: 1,
                    sm: 2,
                },
                p: 0,
            }}>
            <Box
                sx={{
                    gridColumn: {
                        sm: "span 4",
                        md: "span 4",
                    },
                }}>
                {datasets.map(item => (
                    <Typography variant="h2" key={item.teamName}>
                        {item.teamName}
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
