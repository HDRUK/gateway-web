"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { colors } from "@/config/theme";
import { DownloadIcon } from "@/consts/icons";
import Button from "../Button";
import { Column, DetailBanner, Justify, Wrapper } from "./FormBanner.styles";

interface FormBannerProps {
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
                        disabled={!actionButtonsEnabled}
                        sx={{
                            "&.Mui-disabled": {
                                color: colors.grey500,
                            },
                        }}>
                        {t("makeActive")}
                    </Button>
                    |
                    <Button
                        data-testid="btn-save-draft"
                        variant="text"
                        onClick={saveAsDraftAction}
                        disabled={!actionButtonsEnabled}
                        sx={{
                            "&.Mui-disabled": {
                                color: colors.grey500,
                            },
                        }}>
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
