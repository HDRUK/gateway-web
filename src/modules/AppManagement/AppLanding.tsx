import Box from "@/components/Box";
import ImageMediaCard from "@/components/ImageMediaCard";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";

const LandingPage = () => {
    const router = useRouter();

    return (
        <Box
            sx={{
                gridColumn: { tablet: "span 3", laptop: "span 4" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
            <Box sx={{ display: "flex", gap: "40px" }}>
                <ImageMediaCard
                    img="https://place-hold.it/300"
                    href={`/account/team/${router.query.teamId}/integrations/api-management/create`}
                    description="Create API-keys and link to the Gateway"
                    buttonText="Create API-Key"
                />
                <ImageMediaCard
                    img="https://place-hold.it/300"
                    href={`/account/team/${router.query.teamId}/integrations/api-management/list`}
                    description="Manage your linked APIs"
                    buttonText="Manage API"
                />
            </Box>
            <Typography sx={{ fontSize: "20px" }}>
                HDR UK cannot create application registrations on behalf of
                users
            </Typography>
        </Box>
    );
};

export default LandingPage;
