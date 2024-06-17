"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { DownloadIcon } from "@/consts/icons";
import Button from "../Button";
import Paper from "../Paper";
import Tabs from "../Tabs";
import { Tab, TabVariant } from "../Tabs/Tabs";
import { Column, DetailBanner, Justify, Wrapper } from "./FormBanner.styles";

interface FormBannerProps {
    tabItems: Tab[];
    completionPercentage?: number;
    optionalPercentage?: number;
    actionButtonsEnabled?: boolean;
    downloadAction: () => void;
    makeActiveAction: () => void;
    saveAsDraftAction: () => void;
}

const TRANSLATION_PATH = "components.FormBanner";
export const NAVBAR_ID = "form-navbar";

const FormBanner = ({
    tabItems,
    completionPercentage = 0,
    optionalPercentage = 0,
    actionButtonsEnabled = true,
    downloadAction,
    makeActiveAction,
    saveAsDraftAction,
}: FormBannerProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Wrapper id={NAVBAR_ID}>
            <Paper sx={{ m: 0 }}>
                <Tabs
                    variant={TabVariant.SLIM}
                    centered
                    tabs={tabItems}
                    rootBoxSx={{ padding: 0, m: 0 }}
                    renderTabContent={false}
                />
            </Paper>

            <DetailBanner>
                <Column justify={Justify.START}>
                    <Button
                        data-testid="btn-download"
                        variant="text"
                        startIcon={<DownloadIcon />}
                        onClick={downloadAction}>
                        {t("downloadExample")}
                    </Button>
                </Column>
                <Column>
                    <Button
                        data-testid="btn-make-active"
                        variant="text"
                        onClick={makeActiveAction}
                        disabled={!actionButtonsEnabled}>
                        {t("makeActive")}
                    </Button>
                    |
                    <Button
                        data-testid="btn-save-draft"
                        variant="text"
                        onClick={saveAsDraftAction}
                        disabled={!actionButtonsEnabled}>
                        {t("saveDraft")}
                    </Button>
                </Column>
                <Column emphasis justify={Justify.END}>
                    <Typography>{t("completion")}:</Typography>
                    <Typography>
                        {`${completionPercentage}% (${t("requiredFields")})`}
                    </Typography>
                    <Typography>{` // `}</Typography>
                    <Typography>{`${optionalPercentage}% (${t(
                        "optionalFields"
                    )})`}</Typography>
                </Column>
            </DetailBanner>
        </Wrapper>
    );
};

export default FormBanner;
