"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Application } from "@/interfaces/Application";
import Box from "@/components/Box";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import Typography from "@/components/Typography";
import { RouteName } from "@/consts/routeName";
import { formatDate } from "@/utils/date";

interface ApplicationListItemProps {
    application: Application;
}

const ApplicationListItem = ({ application }: ApplicationListItemProps) => {
    const params = useParams<{ teamId: string }>();

    return (
        <Card>
            <Link
                href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}/${RouteName.LIST}/${application.id}`}
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
                            Custom Integration ID: {application.app_id}
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
