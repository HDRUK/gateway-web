import { getTranslations } from "next-intl/server";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Button from "@/components/Button";
import { DownloadIcon } from "@/consts/icons";

const TRANSLATION_PATH = "pages.dataset.components.ActionBar";

const ActionBar = async () => {
    const t = await getTranslations(TRANSLATION_PATH);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
            }}
            style={{ boxShadow: "1px 1px 3px 0px #00000017" }}>
            <BackButton label="Back to search results" style={{ margin: 0 }} />

            <Box sx={{ display: "flex", gap: 1, p: 0 }}>
                <Button disabled>{t("contact")}</Button>

                <Button variant="outlined" color="secondary" disabled>
                    {t("submitApplication")}
                </Button>

                <Button variant="text" startIcon={<DownloadIcon />} disabled>
                    {t("downloadMetadata")}
                </Button>
            </Box>
        </Box>
    );
};

export default ActionBar;
