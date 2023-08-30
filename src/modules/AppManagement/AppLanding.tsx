import Box from "@/components/Box";
import ImgMediaCard from "@/components/ImgMediaCard";
import { Typography } from "@mui/material";
import Link from "@/components/Link";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
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
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                }}>
                <DescriptionOutlinedIcon
                    color="primary"
                    fontSize="large"
                    sx={{ marginRight: "10px" }}
                />
                <Link
                    href="/"
                    color="primary"
                    sx={{ textDecoration: "none", fontSize: "16px" }}>
                    Link to how to create an API
                </Link>
            </div>
            <Box sx={{ display: "flex", gap: "40px" }}>
                <ImgMediaCard
                    img="https://place-hold.it/300"
                    href={`/account/team/${router.query.teamId}/api-management/integrations/create`}
                    description="Create API-keys and link to the Gateway"
                    buttonText="Create API-Key"
                />
                <ImgMediaCard
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
