"use client";

import { ReactNode } from "react";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import Typography from "@/components/Typography";
import {
    getIndicatorColour,
    noteSx,
    rootSx,
} from "./AccessDaysRemaining.styles";

interface AccessDaysRemainingProps {
    daysRemaining: number;
    expiringSoon: boolean;
    note?: ReactNode;
}

const AccessDaysRemaining = ({
    daysRemaining,
    expiringSoon,
    note,
}: AccessDaysRemainingProps) => {
    const t = useTranslations("pages.account.profile.cohortDiscovery");
    const colour = getIndicatorColour(expiringSoon);

    return (
        <Box sx={rootSx}>
            <QueryBuilderIcon sx={{ color: colour }} />
            <Box>
                <Typography
                    component="p"
                    variant="bodySmall"
                    sx={{ color: colour }}>
                    {expiringSoon
                        ? t("accessExpiringIn", { days: daysRemaining })
                        : `${daysRemaining} ${t("daysRemaining")}`}
                </Typography>
                {note && (
                    <Typography component="p" variant="bodySmall" sx={noteSx}>
                        {note}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default AccessDaysRemaining;
