"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { colors } from "@/config/theme";
import Button from "../Button";
import DownloadExternalFile from "../DownloadExternalFile";
import { Column, DetailBanner, Justify, Wrapper } from "./FormBanner.styles";

interface FormBannerProps {
    completionPercentage?: number;
    optionalPercentage?: number;
    actionButtonsEnabled?: boolean;
    makeActiveAction: () => void;
    saveAsDraftAction: () => void;
}

const TRANSLATION_PATH = "components.FormBanner";
const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION || "3.0.0";
const SCHEMA_BRANCH = process.env.NEXT_PUBLIC_SCHEMA_BRANCH || "master";
const FILE_DOWNLOAD_NAME = `HDRUK_${SCHEMA_VERSION}.example.json`;
export const NAVBAR_ID = "form-navbar";

const FormBanner = ({
    completionPercentage = 0,
    optionalPercentage = 0,
    actionButtonsEnabled = true,
    makeActiveAction,
    saveAsDraftAction,
}: FormBannerProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Wrapper id={NAVBAR_ID}>
            <DetailBanner>
                <Column justify={Justify.START}>
                    <DownloadExternalFile
                        apiPath={`https://raw.githubusercontent.com/HDRUK/schemata-2/${SCHEMA_BRANCH}/docs/HDRUK/${SCHEMA_VERSION}.example.json`}
                        buttonText={t("downloadExample")}
                        fileName={FILE_DOWNLOAD_NAME}
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
