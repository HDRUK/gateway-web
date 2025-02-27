import { ListItem, alpha, List } from "@mui/material";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";

interface DarStatusTrackerProps {
    currentStatus: DarApplicationStatus;
    decisionStatus?: DarApplicationApprovalStatus;
    statuses: DarApplicationStatus[];
}

const TRANSLATION_PATH = "common.dar.status";

export default function DarStatusTracker({
    currentStatus,
    decisionStatus,
    statuses,
}: DarStatusTrackerProps) {
    const t = useTranslations(TRANSLATION_PATH);
    const formattedStatuses = [...statuses, decisionStatus || "Decision"];

    return (
        <nav aria-label="Application Progress">
            <List
                sx={{
                    display: "flex",
                    position: "relative",
                    mt: 3,
                    mb: 3,
                }}>
                {formattedStatuses.map((status, index) => {
                    const isActive = status === currentStatus;
                    const isFuture = statuses.indexOf(currentStatus) < index;
                    const isWithdrawn =
                        status === DarApplicationApprovalStatus.WITHDRAWN;
                    const isRejected =
                        status === DarApplicationApprovalStatus.REJECTED;

                    return (
                        <ListItem
                            key={status}
                            sx={{
                                width: 100,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                p: 0,
                                "&:before": {
                                    content: "''",
                                    position: "absolute",
                                    width: 100,
                                    height: "3px",
                                    top: 8,
                                    background: colors.grey400,
                                },
                            }}>
                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "3px solid",
                                    borderColor: isActive
                                        ? alpha(colors.green400, 0.5)
                                        : "transparent",
                                    p: 0,
                                    zIndex: 2,
                                    bgcolor: isRejected
                                        ? colors.red600
                                        : isFuture || isWithdrawn
                                        ? colors.grey500
                                        : isActive
                                        ? colors.white
                                        : colors.green400,
                                }}>
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        bgcolor: isActive
                                            ? colors.green400
                                            : colors.white,
                                        p: 0,
                                    }}
                                />
                            </Box>
                            <Typography sx={{ fontSize: 10 }}>
                                {t(status.toLowerCase())}
                            </Typography>
                        </ListItem>
                    );
                })}
            </List>
        </nav>
    );
}
