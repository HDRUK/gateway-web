import { styled } from "@mui/material";
import Box from "@/components/Box";
import Typography from "@/components/Typography";

interface WrapperProps {
    offsetTop: string;
}

interface ProgressIconProps {
    iconColour: string;
}

const ICON_SIZE = "18px";
const SVG_SIZE = "13px";

export const Wrapper = styled(Box, {
    shouldForwardProp: prop => prop !== "offsetTop",
})<WrapperProps>(({ offsetTop }) => ({
    position: "sticky",
    top: offsetTop,
    padding: 0,
}));

export const LegendIcon = styled("span")<ProgressIconProps>(
    ({ iconColour }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: ICON_SIZE,
        height: ICON_SIZE,
        backgroundColor: iconColour,
        borderRadius: "50%",
        marginRight: "10px",
        flexShrink: 0,

        "& svg": {
            color: "white",
            fontSize: SVG_SIZE,
        },
    })
);

export const BookmarkText = styled(Typography)(({ theme }) => ({
    padding: `${theme.spacing(3)} ${theme.spacing(1)}`,
    borderBottom: `1px solid ${theme.palette.greyCustom.main}`,
    margin: `0 ${theme.spacing(2)}`,
}));
