/** @jsxImportSource @emotion/react */

import Box from "@/components/Box";
import Chip from "@/components/Chip";
import { Integration } from "@/interfaces/Integration";
import Typography from "@/components/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import Card from "@/components/Card";
import { formatDate } from "@/utils/date";

interface IntegrationListItemProps {
    index: number;
    integration: Integration;
}

const IntegrationListItem = ({ index, integration }: IntegrationListItemProps) => {
    const router = useRouter();
    const { teamId } = router.query;

    return (
        <Card>
            <Link
                href={`/account/team/${teamId}/integrations/api-management/list/${integration.id}`}
                style={{
                    textDecoration: "none",
                    color: "#000",
                }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                    }}>
                    <Typography
                        component="span"
                        sx={{
                            fontWeight: "bold",
                            padding: "10px",
                            fontSize: 14,
                        }}>
                        Integration {index} - {'<TYPE>'}
                    </Typography>
                    <Box>
                        <Typography
                            sx={{
                                textAlign: "right",
                                verticalAlign: "top",
                                color: "#868E96",
                            }}>
                            Created -{" "}
                            {formatDate(new Date(integration.created_at))}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            m: 0.2,
                            display: "flex",
                            justifyContent: "end",
                        }}>
                        {integration.enabled ? (
                            <Chip label="Enabled" color="success" />
                        ) : (
                            <Chip label="Disabled" color="error" />
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateRows: "repeat(2, 1fr)",
                            gridColumn: "span 3",
                        }}>
                        <Typography component="span">
                            {integration.name}
                        </Typography>
                    </Box>
                </Box>
            </Link>
        </Card>
    );
};

export default IntegrationListItem;
