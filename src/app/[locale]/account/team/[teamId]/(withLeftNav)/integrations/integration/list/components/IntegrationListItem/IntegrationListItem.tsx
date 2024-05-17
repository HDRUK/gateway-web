"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Integration } from "@/interfaces/Integration";
import Box from "@/components/Box";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import Typography from "@/components/Typography";
import { RouteName } from "@/consts/routeName";
import { formatDate } from "@/utils/date";

interface IntegrationListItemProps {
    index: number;
    integration: Integration;
}

const IntegrationListItem = ({
    index,
    integration,
}: IntegrationListItemProps) => {
    const params = useParams<{ teamId: string }>();

    return (
        <Card>
            <Link
                href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.LIST}/${integration.id}`}
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
                        Integration {index} - {integration.federation_type}
                    </Typography>
                    <Box>
                        <Typography
                            sx={{
                                textAlign: "right",
                                verticalAlign: "top",
                                color: "#868E96",
                            }}>
                            Created - {formatDate(integration.created_at)}
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
                </Box>
            </Link>
        </Card>
    );
};

export default IntegrationListItem;
