"use client";

import { toNumber } from "lodash";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Typography } from "@mui/material";
import useSidebar from "@/hooks/useSidebar";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import useAuth from "@/hooks/useAuth";
import usePost from "@/hooks/usePost";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Enquiry } from "@/interfaces/Enquiry";
import {
    generalEnquiryFormFields,
    generalEnquiryValidationSchema,
    generalEnquiryDefaultValues,
} from "@/config/forms/generalEnquiry";
import apis from "@/config/apis";
import { User } from "@/interfaces/User";
import { useParams } from "next/navigation";

const TRANSLATION_PATH = "pages.dataset.components.DatasetStats";


const GeneralEnquirySidebar = ({
    teamId,
    teamName,
    teamMemberOf,
}: {
    teamId: number;
    teamName: string;
    teamMemberOf: string;
}) => {
    const params = useParams<{
        datasetId: string;
    }>();

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

    const submitForm = async (formData: Enquiry) => {
        console.log("SUBMIT GENERAL ENQUIRY", formData);
        if (!user) return;
        const minUser = { id: user.id };
        console.log(user);
        const payload = {
            ...minUser,
            ...formData,
            team_id: teamId,
            project_title: "Placeholder project title",
            contact_number: formData.contact_number || "", // If not provided, formData.contact_number is null, but we need a string
            datasets: [
                {
                    dataset_id: toNumber(params.datasetId),
                    team_id: teamId,
                    interest_type: "PRIMARY",
                },
            ],
            // dataset_parts_known: "",
            // enabled: true,
            from: user.email, //TODO: use logic to use secondary if preferred
            is_dar_dialogue: false,
            is_dar_status: false,
            // other_datasets: "",
            // unique_key: "78634786478",
            is_feasibility_enquiry: false,
            is_general_enquiry: true,
            // query: "",
        };
        console.log("payload");
        console.log(payload);
        await sendEnquiry(payload).then(res => {
            if (res) {
                hideSidebar();
            };
        });

    };

    useEffect(() => {
        if (!user) {
            return;
        }
        reset({ ...generalEnquiryDefaultValues, ...user });
    }, [reset, user]);

    return (
                <>
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
                            <Typography variant="h1">
                                {teamMemberOf} {">"}{" "}
                                {teamName}
                            </Typography>
                            <Typography>
                                Send a general enquiry to
                                one or multiple Data
                                Custodians. You will receive
                                an email copy of the enquiry
                                sent. The Data Custodian(s)
                                will reply via email to your
                                preferred email address,
                                with a copy shared with the
                                Gateway.
                            </Typography>

                            <Form
                                sx={{ mt: 3 }}
                                onSubmit={handleSubmit(
                                    submitForm
                                )}>
                                {hydratedFormFields.map(
                                    field => (
                                        <InputWrapper
                                            key={field.name}
                                            control={
                                                control
                                            }
                                            {...field}
                                        />
                                    )
                                )}

                                <Box
                                    sx={{
                                        p: 0,
                                        display: "flex",
                                        justifyContent:
                                            "end",
                                    }}>
                                    <Button type="submit">
                                        Save changes
                                    </Button>
                                </Box>
                            </Form>
                        </Box>
                    </BoxContainer>
                </>
            )
        ;

};

export default GeneralEnquirySidebar;
