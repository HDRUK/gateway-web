"use client";

import Image from "next/image";
import Typography from "@/components/Typography";
import theme from "@/config/theme";

export interface BannerProps {
    title?: string;
    subTitle?: string;
    src?: string;
}

const Banner = ({ title, subTitle, src }: BannerProps) => (
    <div
        style={{
            position: "relative",
            width: "100vw",
            maxWidth: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
            background: `linear-gradient(97deg, #46AF93 4.05%, ${theme.palette.primary.main} 100%)`,
        }}>
        <div
            style={{
                zIndex: 1,
                position: "absolute",
                display: "flex",
                textAlign: "center",
                flexDirection: "column",
                gap: theme.spacing(2),
                color: "white",
                maxWidth: "550px",
                padding: "0 20px",
            }}>
            {title && <Typography style={{ fontSize: 40 }}>{title}</Typography>}
            {subTitle && <Typography>{subTitle}</Typography>}
        </div>
        {src && title && (
            <Image style={{ objectFit: "cover" }} fill src={src} alt={title} />
        )}
    </div>
);

export default Banner;
