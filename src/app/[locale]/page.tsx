import * as React from "react";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Container from "@/components/Container";
import { HOME, PAGES, TEXT, TITLE } from "@/consts/translation";

export default function HomePage() {
    const t = useTranslations(`${PAGES}.${HOME}`);

    return (
        <Container
            sx={{
                gridTemplateColumns: "repeat(5, 1fr)",
            }}>
            <Box sx={{ p: 5 }}>
                <h1>{t(TITLE)}</h1>
                <p>{t(TEXT)}</p>
            </Box>
        </Container>
    );
}
