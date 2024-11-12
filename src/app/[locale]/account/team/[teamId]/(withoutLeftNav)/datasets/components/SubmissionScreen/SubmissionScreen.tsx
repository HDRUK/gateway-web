"use client";

import { useEffect, useState } from "react";
import { FieldValues, FieldErrors, UseFormTrigger } from "react-hook-form";
import { yellow } from "@mui/material/colors";
import Markdown from "markdown-to-jsx";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Button from "@/components/Button";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { CheckCircleRoundedIcon, WarningRoundedIcon } from "@/consts/icons";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";

const ICON_SIZE = "130px";

interface SubmissionScreenProps {
    makeActiveDisabled: boolean;
    trigger: UseFormTrigger<FieldValues>;
    errors?: FieldErrors<FieldValues>;
    makeActiveAction: () => void;
}

const SubmissionScreen = ({
    makeActiveDisabled = false,
    trigger,
    errors,
    makeActiveAction,
}: SubmissionScreenProps) => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.CreateDataset`
    );

    const [isValid, setIsValid] = useState<boolean>();
    const [errorText, setErrorText] = useState<string>("");

    useEffect(() => {
        if (!trigger) {
            return;
        }
        const checkFormValidation = async () => {
            const isValid = await trigger();
            setIsValid(isValid);
        };

        checkFormValidation();
    }, [trigger]);

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            // Concatenate error messages with new lines
            const concatenatedErrors = `   * ${Object.values(errors)
                .map(error => error?.message)
                .filter(error => error) // Filter out any empty strings
                .join("\n   * ")}`;

            setErrorText(concatenatedErrors);
        }
    }, [isValid, errors]);

    return (
        <Box sx={{ mt: 1.25, display: "flex", justifyContent: "center" }}>
            <Box sx={{ flex: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        textAlign: "center",
                    }}>
                    {isValid ? (
                        <CheckCircleRoundedIcon
                            sx={{
                                color: colors.green400,
                                height: ICON_SIZE,
                                width: ICON_SIZE,
                            }}
                        />
                    ) : (
                        <WarningRoundedIcon
                            sx={{
                                color: yellow[700],
                                height: ICON_SIZE,
                                width: ICON_SIZE,
                            }}
                        />
                    )}
                    <Typography variant="h2" sx={{ fontWeight: "bold", mt: 1 }}>
                        {isValid ? (
                            t("submissionValid")
                        ) : (
                            <TooltipIcon
                                content={<Markdown>{errorText}</Markdown>}
                                label={t("submissionInvalid")}
                            />
                        )}
                    </Typography>
                    <Typography sx={{ fontSize: "1rem" }}>
                        {isValid
                            ? t("submissionValidText")
                            : t("submissionInvalidText")}
                    </Typography>

                    {isValid && (
                        <Button
                            onClick={makeActiveAction}
                            sx={{ mt: 2 }}
                            disabled={makeActiveDisabled}>
                            {t("makeActive")}
                        </Button>
                    )}
                </Box>
            </Box>
            <Box sx={{ flex: 1 }} />
        </Box>
    );
};

export default SubmissionScreen;
