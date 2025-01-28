"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { colors } from "@/config/theme";
import Button from "../Button";
import DownloadFile from "../DownloadFile";
import { Column, DetailBanner, Justify, Wrapper } from "./FormBanner.styles";

type DownloadDetails = {
    name: string;
    path: string;
    isExternal?: boolean;
};

interface FormBannerProps {
    completionPercentage?: number;
    optionalPercentage?: number;
    actionButtonsEnabled?: boolean;
    translationPath: string;
    downloadDetails: DownloadDetails;
    makeActiveAction: () => void;
    saveAsDraftAction: () => void;
}

export const NAVBAR_ID = "form-navbar";

const FormBanner = ({
    completionPercentage = 0,
    optionalPercentage = 0,
    actionButtonsEnabled = true,
    translationPath,
    downloadDetails,
    makeActiveAction,
    saveAsDraftAction,
}: FormBannerProps) => {
    const t = useTranslations(translationPath);

    return (
        <Wrapper id={NAVBAR_ID}>
            <DetailBanner>
                <Column justify={Justify.START}>
                    <DownloadFile
                        apiPath={downloadDetails.path}
                        externalFileName={downloadDetails.name}
                        isExternalFile={downloadDetails.isExternal}
                        buttonText={t("downloadButtonText")}
                        buttonSx={{ mb: 0 }}
                    />
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
