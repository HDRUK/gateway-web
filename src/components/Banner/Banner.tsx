/** @jsxImportSource @emotion/react */

import Typography from "@/components/Typography";
import Image, { StaticImageData } from "next/image";
import * as styles from "./Banner.styles";

export interface BannerProps {
    title: string;
    subTitle?: string;
    src: StaticImageData;
}

const Banner = ({ title, subTitle, src }: BannerProps) => {
    return (
        <div css={styles.banner}>
            <div css={styles.content}>
                <Typography style={{ fontSize: 40 }}>{title}</Typography>
                {subTitle && <Typography>{subTitle}</Typography>}
            </div>
            <Image style={{ objectFit: "cover" }} fill src={src} alt={title} />
        </div>
    );
};

export default Banner;
