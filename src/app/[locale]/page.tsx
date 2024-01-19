import * as React from "react";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Container from "@/components/Container";

export default function HomePage() {
    const t = useTranslations("pages.home");

    return (
        <Container
            sx={{
                gridTemplateColumns: "repeat(5, 1fr)",
            }}>
            <Box sx={{ p: 5 }}>
                <h1>{t("title")}</h1>
                <p>{t("text")}</p>
            </Box>
        </Container>
    );
}
