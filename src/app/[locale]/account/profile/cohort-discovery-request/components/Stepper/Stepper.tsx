import { ReactNode } from "react";
import CheckIcon from "@mui/icons-material/Check";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box } from "@mui/material";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { STEP_STATE } from "@/app/[locale]/account/profile/cohort-discovery-request/components/Stepper/config";
import { CircleState, connectorSx, getCircleSx } from "./Stepper.styles";

export const StepNode = ({
    circleState,
    label,
    small,
    isLast,
    children,
}: {
    circleState: CircleState;
    label: string;
    small?: boolean;
    isLast?: boolean;
    children: ReactNode;
}) => (
    <Box sx={{ display: "flex", gap: 2 }}>
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
            <Box sx={getCircleSx(circleState, small)}>
                {circleState === STEP_STATE.COMPLETE ? (
                    <CheckIcon fontSize="small" />
                ) : circleState === STEP_STATE.LOCKED ? (
                    <LockOutlinedIcon fontSize="small" />
                ) : (
                    label
                )}
            </Box>
            {!isLast && <Box sx={connectorSx} />}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, pb: isLast ? 0 : 4 }}>{children}</Box>
    </Box>
);

export const StepTitle = ({
    children,
    small,
    muted,
}: {
    children: ReactNode;
    small?: boolean;
    muted?: boolean;
}) => (
    <Typography
        sx={{
            fontWeight: 600,
            fontSize: small ? 16 : 18,
            color: muted ? colors.grey500 : colors.grey900,
            mb: 0.5,
        }}>
        {children}
    </Typography>
);
