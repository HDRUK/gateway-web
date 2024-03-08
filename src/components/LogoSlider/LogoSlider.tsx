/** @jsxImportSource @emotion/react */
import Image from "next/image";
import Box from "@/components/Box";
import * as styles from "./LogoSlider.styles";

type Logo = { alt: string; imageSrc: string; websiteUrl: string };
interface LogoSliderProps {
    logos: Logo[];
}

const LogoComponent = ({ logo }: { logo: Logo }) => (
    <a
        css={styles.anchor}
        href={logo.websiteUrl}
        target="_blank"
        rel="noreferrer">
        <Image
            style={{ objectFit: "contain" }}
            fill
            src={logo.imageSrc}
            alt={logo.alt}
        />
    </a>
);

const LogoSlider = ({ logos }: LogoSliderProps) => {
    return (
        <Box css={styles.tickerContainer}>
            <div css={styles.ticker({ logoCount: logos.length })}>
                {logos.map(logo => (
                    <LogoComponent logo={logo} />
                ))}
                {logos.map(logo => (
                    <LogoComponent logo={logo} />
                ))}
            </div>
        </Box>
    );
};

export default LogoSlider;
