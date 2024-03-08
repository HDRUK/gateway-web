/** @jsxImportSource @emotion/react */
import Image from "next/image";
import Box from "@/components/Box";
import * as styles from "./LogoSlider.styles";

interface LogoSliderProps {
    logos: { alt: string; imageSrc: string; websiteUrl: string }[];
}

const LogoSlider = ({ logos }: LogoSliderProps) => {
    return (
        <Box sx={{ background: "white", overflow: "hidden" }}>
            <div css={styles.ticker}>
                {logos.map(logo => (
                    <a
                        style={{
                            marginLeft: 10,
                            marginRight: 10,
                            width: 100,
                            flex: "none",
                            alignSelf: "flex-start",
                        }}
                        href={logo.websiteUrl}
                        target="_blank"
                        rel="noreferrer">
                        <Image
                            width={100}
                            height={50}
                            src={logo.imageSrc}
                            alt={logo.alt}
                        />
                    </a>
                ))}
            </div>
        </Box>
    );
};

export default LogoSlider;
