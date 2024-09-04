"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import Button from "../Button";
import DownloadFile from "../DownloadFile";
import { Column, DetailBanner, Justify, Wrapper } from "./FormBanner.styles";

interface FormBannerProps {
    completionPercentage?: number;
    optionalPercentage?: number;
    actionButtonsEnabled?: boolean;
    makeActiveAction: () => void;
    saveAsDraftAction: () => void;
}

const TRANSLATION_PATH = "components.FormBanner";
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
                    <DownloadFile
                        apiPath={`${apis.datasetsExportV1Url}/mock?type=dataset_metadata`}
                        buttonText={t("downloadExample")}
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
