import Link from "@/components/Link";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import Button from "../Button/Button";

const CustomButton = styled(Button)(() => ({
    color: "#3C3C3B",
    padding: "10px 16px",
    width: "75px",
    height: "40px",
    border: "2px solid #3db28c",
    borderRadius: "4px",
    fontWeight: "400",
    fontSize: "14px",
    textTransform: "none",
    lineHeight: "17px",
    whiteSpace: "nowrap",
}));

const signInHandler = () => {
    console.log("test");
};

function Header() {
    return (
        <AppBar
            position="static"
            color="transparent"
            sx={{
                mb: "10px",
                flexDirection: "row",
            }}>
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}>
                <Box
                    sx={{
                        display: { mobile: "none", tablet: "block" },
                    }}>
                    <Link
                        href="/"
                        label={
                            <Image
                                src="/assets/gateway_main.svg"
                                width={110}
                                height={50}
                                alt="home-logo"
                            />
                        }
                    />
                </Box>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{
                        mr: 2,
                        fill: "#475DA7",
                        display: { tablet: "none", mobile: "block" },
                    }}>
                    <MenuIcon />
                </IconButton>
                <Box
                    sx={{
                        flexGrow: 1,
                        justifyContent: "flex-start",
                        display: {
                            tablet: "none",
                            mobile: "none",
                            laptop: "flex",
                        },
                    }}>
                    <Typography
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#53575A",
                            ml: "40px",
                            mr: "25px",
                            cursor: "pointer",
                        }}>
                        Explore
                        <ExpandMoreIcon sx={{ fill: "#475DA7" }} />
                    </Typography>
                    <Typography
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#53575A",
                            mr: "25px",
                            cursor: "pointer",
                        }}>
                        Help
                        <ExpandMoreIcon sx={{ fill: "#475DA7" }} />
                    </Typography>
                    <Typography
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#53575A",
                            mr: "25px",
                            cursor: "pointer",
                        }}>
                        Usage data
                        <ExpandMoreIcon sx={{ fill: "#475DA7" }} />
                    </Typography>
                    <Typography
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#53575A",
                            mr: "25px",
                            cursor: "pointer",
                        }}>
                        About us
                        <ExpandMoreIcon sx={{ fill: "#475DA7" }} />
                    </Typography>
                    <Link
                        href="/"
                        label="News"
                        sx={{
                            color: "#53575A",
                            mr: "25px",
                            textDecoration: "none",
                        }}
                    />
                    <Link
                        href="/"
                        label="News"
                        sx={{
                            color: "#53575A",
                            mr: "25px",
                            textDecoration: "none",
                        }}
                    />
                </Box>
                <CustomButton
                    variant="outlined"
                    size="medium"
                    onClick={signInHandler}>
                    Sign in
                </CustomButton>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
