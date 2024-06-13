import { css, keyframes } from "@emotion/react";

const infiniteAnimation = (logoCount: number) => keyframes`
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-${logoCount * 120}px);
  }

`;

export const tickerContainer = css({
    background: "white",
    overflow: "hidden",
});

export const anchor = css({
    marginLeft: 10,
    marginRight: 10,
    width: 100,
    height: 50,
    position: "relative",
    flex: "none",
    alignSelf: "flex-start",
    maxWidth: "100%",
});

export const ticker = ({ logoCount }: { logoCount: number }) =>
    css({
        marginLeft: "-1rem",
        marginRight: "-1rem",
        display: "flex",
        "&:hover": { animationPlayState: "paused" },
        animation: `${infiniteAnimation(logoCount)} 18s linear infinite`,
    });
