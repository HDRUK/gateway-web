/* eslint-disable camelcase */
/** @jsxImportSource @emotion/react */

import Box from "@/components/Box";
import ChipComponent from "@/components/Chip";
import { Application } from "@/interfaces/Application";
import { Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

interface ApplicationListItemProps {
    application: Application;
}

const ApplicationListItem = ({ application }: ApplicationListItemProps) => {
    const formattedDate = new Date(application.created_at).toLocaleDateString(
        "en",
        {
            year: "numeric",
            day: "2-digit",
            month: "long",
        }
    );

    const router = useRouter();
    const { teamId } = router.query;

    return (
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
                        Created - {formattedDate}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        m: 0.2,
                    }}>
                    {application.enabled ? (
                        <ChipComponent label="Enabled" color="success" />
                    ) : (
                        <ChipComponent label="Disabled" color="error" />
                    )}

                    {/* Place holder for which scopes/permissions have been selected for the app */}
                    <ChipComponent
                        label="{{api.scope.permission}}"
                        color="info"
                        sx={{
                            marginLeft: 1,
                        }}
                    />
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
    );
};

export default ApplicationListItem;
