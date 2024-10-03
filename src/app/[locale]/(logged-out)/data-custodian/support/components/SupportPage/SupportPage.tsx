"use client";

import { ReactNode } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { RouteName } from "@/consts/routeName";
import ContactSupport from "@/app/[locale]/(logged-out)/support/components/ContactSupport";

const TRANSLATIONS_NAMESPACE_SUPPORT = "pages.dataCustodianSupport";

interface SupportPageProps {
    title?: string;
    content?: string;
    children?: ReactNode;
}

export default function SupportPage({
    title,
    content,
    children,
}: SupportPageProps) {
    const router = useRouter();
    const t = useTranslations(TRANSLATIONS_NAMESPACE_SUPPORT);

    const handleBackClick = () => {
        router.push(`${RouteName.DATA_CUSTODIAN_SUPPORT}`);
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
                </header>
                <Divider sx={{ mb: 2 }} />
                {content && <HTMLContent content={content} />}
                {children}
                <Box sx={{ mt: 5 }}>
                    <ContactSupport />
                </Box>
            </Container>
        </>
    );
}
