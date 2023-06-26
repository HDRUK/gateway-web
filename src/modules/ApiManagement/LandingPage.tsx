import Box from "@/components/Box";
import SquareButton from "@/components/SquareButton";
import AddIcon from "@mui/icons-material/Add";
import { Typography } from "@mui/material";
import Link from "@/components/Link";
import Image from "next/image";
import { useRouter } from "next/router";
import paper from "../../../public/assets/icons/paper.svg";

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
            <div style={{ display: "flex" }}>
                <Image src={paper} alt="paper icon" height="24" width="24" />
                <Link
                    href="/"
                    color="primary"
                    sx={{ textDecoration: "none", fontSize: "16px" }}>
                    Link to how to create an API (placeholder)
                </Link>
            </div>
            <Box sx={{ display: "flex", gap: "40px" }}>
                <SquareButton
                    color="primary"
                    icon={<AddIcon sx={{ fontSize: "41px" }} />}
                    onClick={() =>
                        router.push("/account/appRegistration/appManagement")
                    }>
                    Create API
                </SquareButton>
                <SquareButton
                    color="primary"
                    onClick={() =>
                        router.push("/account/appRegistration/apiList")
                    }>
                    Manage API
                </SquareButton>
            </Box>
            <Typography sx={{ fontSize: "20px" }}>
                *HDRUK cannot create application registrations on behalf of
                users
            </Typography>
        </Box>
    );
};

export default LandingPage;
