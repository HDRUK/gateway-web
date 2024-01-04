"use client";

import { Box, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Link from "@/components/Link";
import useDialog from "@/hooks/useDialog";
import { RouteName } from "@/consts/routeName";
import {
    ABOUT,
    COHORT_DISCOVERY_REQUEST,
    COMMON,
    PAGES,
    TEXT,
    TITLE,
} from "@/consts/translation";
import CohortRequestSentDialog from "../CohortRequestSentDialog";

const TERMS_CONDITIONS = "terms";
const SUBMIT = "submit";
const CANCEL = "cancel";
const COHORT_TEXT = `${PAGES}.${ABOUT}.${COHORT_DISCOVERY_REQUEST}`;

const CohortDisoveryRequestForm = () => {
    const { push } = useRouter();
    const { showDialog } = useDialog();
    const t = useTranslations();

    const handleSubmit = () => {
        showDialog(CohortRequestSentDialog);
    };

    const handleCancel = () => {
        push(`/${RouteName.ABOUT}/${RouteName.COHORT_DISCOVERY}`);
    };

    return (
        <BoxContainer
            sx={{
                p: 4,
            }}>
            <Paper sx={{ mb: 2 }}>
                <Box sx={{ p: 4 }}>
                    <Typography variant="h2">
                        {t(`${COHORT_TEXT}.${TITLE}`)}
                    </Typography>
                    <Typography sx={{ marginBottom: 2 }}>
                        {t.rich(`${COHORT_TEXT}.${TEXT}`, {
                            userprofile: chunks => (
                                <Link
                                    href={`/${RouteName.ACCOUNT}/${RouteName.PROFILE}`}>
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </Typography>
                    <Typography>
                        {t.rich(`${COHORT_TEXT}.${TERMS_CONDITIONS}`, {
                            terms: chunks => (
                                <Link href={`/${RouteName.TERMS}`}>
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </Typography>
                </Box>
            </Paper>

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                }}>
                <Button onClick={handleSubmit}>
                    {t(`${COMMON}.${SUBMIT}`)}
                </Button>
                <Button variant="text" onClick={handleCancel}>
                    {t(`${COMMON}.${CANCEL}`)}
                </Button>
            </Box>
        </BoxContainer>
    );
};

export default CohortDisoveryRequestForm;
