"use client";

import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { RouteName } from "@/consts/routeName";
import ContactSupport from "../ContactSupport";

const TRANSLATIONS_NAMESPACE_SUPPORT = "pages.support";

interface SupportPageProps {
    title: string;
    description?: ReactNode;
}

export default function SupportPage({ title, description }: SupportPageProps) {
    const router = useRouter();
    const t = useTranslations(TRANSLATIONS_NAMESPACE_SUPPORT);

    const handleBackClick = () => {
        router.push(`/${RouteName.SUPPORT}`);
    };

    return (
        <>
            <Banner title={title} />
            <Container sx={{ background: "white", px: 10, py: 3 }}>
                <BackButton
                    label={t("backToSupport")}
                    onClick={handleBackClick}
                />
                <header>
                    <Typography variant="h2">{title}</Typography>
                    {description && <Typography>{description}</Typography>}
                </header>
                <Box sx={{ mt: 5 }}>
                    <ContactSupport />
                </Box>
            </Container>
        </>
    );
}
