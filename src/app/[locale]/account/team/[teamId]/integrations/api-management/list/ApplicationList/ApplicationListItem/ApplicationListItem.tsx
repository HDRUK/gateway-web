/** @jsxImportSource @emotion/react */

"use client";

import Box from "@/components/Box";
import Chip from "@/components/Chip";
import { Application } from "@/interfaces/Application";
import Typography from "@/components/Typography";
import Link from "next/link";

import Card from "@/components/Card";
import { formatDate } from "@/utils/date";
import { useParams } from "next/navigation";

interface ApplicationListItemProps {
    application: Application;
}

const ApplicationListItem = ({ application }: ApplicationListItemProps) => {
    const { teamId } = useParams();

    return (
        <Card>
            <Link
                href={`/account/team/${teamId}/integrations/api-management/list/${application.id}`}
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
                        {application.name}
                    </Typography>
                    <Box>
                        <Typography
                            sx={{
                                textAlign: "right",
                                verticalAlign: "top",
                                color: "#868E96",
                            }}>
                            Created - {formatDate(application.created_at)}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            m: 0.2,
                            display: "flex",
                            justifyContent: "end",
                        }}>
                        {application.enabled ? (
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
                            APP ID: {application.app_id}
                        </Typography>
                        <Typography component="span">
                            Description: {application.description}
                        </Typography>
                    </Box>
                </Box>
            </Link>
        </Card>
    );
};

export default ApplicationListItem;
