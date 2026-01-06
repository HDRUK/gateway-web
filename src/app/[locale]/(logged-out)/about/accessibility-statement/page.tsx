import { getTranslations } from "next-intl/server";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import metaData from "@/utils/metadata";

export const metadata = metaData({
    title: "Accessibility Statement",
    description: "",
});

const TRANSLATION_PATH = "pages.about.accessibilityStatement";
const ACCESSIBILITY_ENDPOINT = `https://raw.githubusercontent.com/HDRUK/accessibility-statement/refs/heads/main/gateway.md`;

const AccessibilityStatementPage = async () => {
    const res = await fetch(ACCESSIBILITY_ENDPOINT, {
        next: {
            revalidate: 180,
            tags: ["all", `accessibility`],
        },
        cache: "force-cache",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch accessibility statement");
    }
    const t = await getTranslations(TRANSLATION_PATH);
    const accessibilityText = await res.text();

    return (
        <>
            <Banner title={t("title")} subTitle={t("subTitle")} />
            <Container sx={{ padding: 10 }}>
                {accessibilityText && (
                    <MarkDownSanitizedWithHtml content={accessibilityText} />
                )}
            </Container>
        </>
    );
};

export default AccessibilityStatementPage;
