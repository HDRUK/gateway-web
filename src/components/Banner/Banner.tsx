import Image from "next/image";
import Typography from "@/components/Typography";

export interface BannerProps {
    title: string;
    subTitle?: string;
    src: string;
}

const Banner = ({ title, subTitle, src }: BannerProps) => {
    return (
        <div
            style={{
                position: "relative",
                width: "100vw",
                maxWidth: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
            }}>
            <div
                style={{
                    zIndex: 1,
                    position: "absolute",
                    display: "flex",
                    textAlign: "center",
                    flexDirection: "column",
                    gap: "10px",
                    color: "white",
                    maxWidth: "550px",
                    padding: "0 20px",
                }}>
                <Typography style={{ fontSize: 40 }}>{title}</Typography>
                {subTitle && <Typography>{subTitle}</Typography>}
            </div>
            <Image style={{ objectFit: "cover" }} fill src={src} alt={title} />
        </div>
    );
};

export default Banner;
