import { Card, styled } from "@mui/material";
import Image from "next/image";
import { colors } from "@/config/colors";

export const StatCard = styled(Card)(() => ({
    display: "flex",
    flexDirection: "column",
    background: `linear-gradient(90deg,${colors.purple400} 100%, ${colors.white} 13px)`,
    color: colors.white,
    borderRadius: 5,
    boxShadow: "3px 3px 6px 0px rgba(0,0,0,.09)",
    paddingRight: "13px",
    minHeight: "121px",
    outline: "none",
    "&:hover, &:focus-visible": {
        boxShadow: `0 0 0 3px ${colors.yellow500}`,
        transition: "box-shadow 0.2s ease-in-out",
    },
}));

export const Title = styled("div")(() => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
}));

export const InfoWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
    paddingTop: 0,
    flex: 1,
}));

export const StatWrapper = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: "1 0 50%",
}));

export const StatImageWrapper = styled("div")(() => ({
    flex: "1 0 50%",
    position: "relative",
}));

export const StatImage = styled(Image)(({ theme }) => ({
    paddingLeft: theme.spacing(1),
}));
