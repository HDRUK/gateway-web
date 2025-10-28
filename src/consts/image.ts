import { styled } from "@mui/material";
import Image from "next/image";

export enum ImageValidationError {
    RATIO = "ratio",
    SIZE = "size",
}

export const AspectRatioImage = styled(Image)(() => ({
    width: "auto",
    maxHeight: "20vw",
    maxWidth: "30vw",
    height: "100%",
}));
