/** @jsxImportSource @emotion/react */

"use client";

import Box from "@/components/Box";
import Chip from "@/components/Chip";
import { Integration } from "@/interfaces/Integration";
import Typography from "@/components/Typography";
import Link from "next/link";

import { useParams } from "next/navigation";
import Card from "@/components/Card";
import { formatDate } from "@/utils/date";

interface IntegrationListItemProps {
    index: number;
    integration: Integration;
}

const IntegrationListItem = ({
    index,
    integration,
}: IntegrationListItemProps) => {
    const { teamId } = useParams();

    return (
        <Card>
            <Link
                href={`/account/team/${teamId}/integrations/integration/list/${integration.id}`}
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
                </Box>
            </Link>
        </Card>
    );
};

export default IntegrationListItem;
