import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Button, GlobalStyles } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import Box from "@/components/Box";
import theme from "@/config/theme";

type Logo = { alt: string; imageSrc: string; websiteUrl: string };
interface LogoSliderProps {
    logos: Logo[];
}

const LogoComponent = ({
    logo,
    setPaused,
    selectable,
}: {
    logo: Logo;
    setPaused: Dispatch<SetStateAction<boolean>>;
    selectable: boolean;
}) => {
    const ref = useRef<HTMLAnchorElement>(null);

    return (
        <Button
            tabIndex={selectable ? 0 : -1}
            disableRipple
            component={NextLink}
            sx={{
                width: 100,
                height: 50,
                position: "relative",
                display: "inline-block",
                "&.Mui-focusVisible": {
                    borderRadius: 0,
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: 2,
                },
            }}
            href={logo.websiteUrl}
            target="_blank"
            rel="noreferrer"
            ref={ref}
            onBlur={() => setPaused(false)}
            onFocusVisible={() => {
                setPaused(true);

                ref.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }}>
            <Image
                style={{
                    objectFit: "contain",
                    display: "inline-block",
                }}
                fill
                src={logo.imageSrc}
                alt={`Logo for ${logo.alt}`}
            />
        </Button>
    );
};
const CAROUSEL_SPEED_SECONDS = 18;

const LogoSlider = ({ logos }: LogoSliderProps) => {
    const [paused, setPaused] = useState(false);

    return (
        <>
            <GlobalStyles
                styles={{
                    "@keyframes infiniteAnimation": {
                        "0%": {
                            transform: "translateX(0%)",
                        },
                        "100%": {
                            transform: `translateX(-50%)`,
                        },
                    },
                }}
            />
            <Box
                sx={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    padding: 0,
                }}>
                <Box
                    sx={{
                        display: "inline-flex",
                        gap: 3,
                        animation: paused
                            ? "none"
                            : `infiniteAnimation ${CAROUSEL_SPEED_SECONDS}s linear infinite`,
                        "&:hover, &:focus-within": {
                            animationPlayState: "paused",
                        },
                        minWidth: "200%",
                    }}>
                    {[...logos, ...logos].map((logo, index) => (
                        <LogoComponent
                            key={`${logo.alt}-${index}`}
                            logo={logo}
                            setPaused={setPaused}
                            selectable={index < logos.length}
                        />
                    ))}
                </Box>
            </Box>
        </>
    );
};

export default LogoSlider;
