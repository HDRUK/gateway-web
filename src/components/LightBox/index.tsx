"use client";

import CloseIcon from "@mui/icons-material/Close";
import { Modal, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import { colors } from "@/config/theme";
import { useGatewayStore } from "@/store/useGatewayStore";
import { galleryStyle } from "./style";

export const LightBox = () => {
    const { lightBoxImage, SetLightBoxImage } = useGatewayStore();

    const handleClose = () => {
        SetLightBoxImage(undefined);
    };

    return (
        <Modal
            open={!!lightBoxImage}
            onClose={handleClose}
            aria-label="Enlarged image">
            <Container maxWidth={false}>
                <Box sx={galleryStyle.box}>
                    <IconButton
                        aria-label="Close"
                        size="small"
                        onClick={handleClose}
                        sx={galleryStyle.iconButton}>
                        <CloseIcon
                            fontSize="inherit"
                            sx={galleryStyle.closeIcon}
                        />
                    </IconButton>
                    {lightBoxImage && (
                        <figure style={galleryStyle.figure}>
                            <Image
                                unoptimized
                                src={lightBoxImage.src}
                                alt={`Enlarged ${lightBoxImage.alt}`}
                                loading="eager"
                                quality={100}
                                sizes={lightBoxImage.sizes ?? "100vw"}
                                width={0}
                                height={0}
                                style={galleryStyle.image}
                                priority
                            />
                            {lightBoxImage.title && (
                                <Box
                                    sx={{ width: "100%" }}
                                    component="figcaption">
                                    <Typography
                                        variant="body1"
                                        color={colors.white}>
                                        {lightBoxImage.title}
                                    </Typography>
                                </Box>
                            )}
                        </figure>
                    )}
                </Box>
            </Container>
        </Modal>
    );
};
