/* eslint-disable camelcase */
/** @jsxImportSource @emotion/react */

import Box from "@/components/Box";
import ChipComponent from "@/components/Chip";
import { Application } from "@/interfaces/Application";
import { Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const ApplicationListItem = ({
    name,
    id,
    description,
    created_at,
    tags,
    enabled,
    app_id,
}: Application) => {
    const formattedDate = new Date(created_at).toLocaleDateString("en", {
        year: "numeric",
        day: "2-digit",
        month: "long",
    });

    const router = useRouter();
    const { teamId } = router.query;

    return (
        <Link
            href={`/account/application/edit?id=${id}&teamId=${teamId}`}
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
                    {name}
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
                    {enabled ? (
                        <ChipComponent label="Activated" color="success" />
                    ) : (
                        <ChipComponent label="Deactivated" color="error" />
                    )}

                    {tags.map(tag => (
                        <ChipComponent label={tag.description} />
                    ))}
                </Box>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateRows: "repeat(2, 1fr)",
                        gridColumn: "span 3",
                    }}>
                    <Typography component="span">APP ID: {app_id}</Typography>
                    <Typography component="span">
                        Description: {description}
                    </Typography>
                </Box>
            </Box>
        </Link>
    );
};

export default ApplicationListItem;
