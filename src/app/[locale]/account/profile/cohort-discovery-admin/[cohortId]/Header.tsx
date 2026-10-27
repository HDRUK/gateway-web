import { useTranslations } from "next-intl";
import { CohortRequest } from "@/interfaces/CohortRequest";
import Box from "@/components/Box";
import Chip from "@/components/Chip";
import Typography from "@/components/Typography";
import { NHSSDEStatusMapping, statusMapping } from "@/consts/cohortDiscovery";
import { capitalise } from "@/utils/general";

export default function Header({
    cohortRequest,
}: {
    cohortRequest: CohortRequest;
}) {
    const t = useTranslations("pages.account.profile.cohortDiscoveryAdmin");
    return (
        <Box
            sx={{
                p: 0,
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
            }}>
            <Typography variant="h2">
                {cohortRequest.user.name}
                <Typography
                    sx={{ ml: 1, color: "text.secondary", fontSize: 18 }}
                    variant="body1"
                    component="span">
                    {cohortRequest.user.email}
                </Typography>
            </Typography>
            <Box
                sx={{
                    p: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    gap: 4,
                }}>
                {cohortRequest?.request_status && (
                    <Box
                        sx={{
                            p: 0,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}>
                        <Typography>{t("generalHeader")}</Typography>
                        <Chip
                            size="small"
                            label={capitalise(cohortRequest?.request_status)}
                            {...statusMapping[cohortRequest?.request_status]}
                        />
                    </Box>
                )}
                {cohortRequest?.nhse_sde_request_status && (
                    <Box
                        sx={{
                            p: 0,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}>
                        <Typography>{t("nhseHeader")}</Typography>
                        <Chip
                            size="small"
                            label={capitalise(
                                cohortRequest?.nhse_sde_request_status
                            )}
                            {...NHSSDEStatusMapping[
                                cohortRequest?.nhse_sde_request_status
                            ]}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}
