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
import Chat from "@/components/Chat";
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

const ChatSidebar = () => {
    const { hideSidebar } = useSidebar();

    const t = useTranslations(TRANSLATION_PATH);

    const { user } = useAuth();

    const chatData = {
        messages: [
            {
                id: 1,
                created_at: "2024-10-21T14:30:59.000000Z",
                updated_at: "2024-10-21T14:30:59.000000Z",
                thread_id: 1,
                from: "keenan.jaskolski@kuhic.com",
                message_body:
                    "Sit nulla rerum amet autem sapiente. Voluptatem rem sequi quidem sit quia nihil dolorem. Sequi nihil et hic. Ut nisi fuga repudiandae sed itaque qui.",
                enabled: 1,
            },
            {
                id: 2,
                created_at: "2024-10-21T14:31:59.000000Z",
                updated_at: "2024-10-21T14:31:59.000000Z",
                thread_id: 1,
                from: "your.email@example.com",
                message_body: "Hello! How can I help you today?",
                enabled: 1,
            },
            // Add more messages here...
        ],
    };

    const currentUser = "your.email@example.com"; // Current user email

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
                <Chat messages={chatData.messages} currentUser={currentUser} />
            </Box>
        </BoxContainer>
    );
};

export default ChatSidebar;
