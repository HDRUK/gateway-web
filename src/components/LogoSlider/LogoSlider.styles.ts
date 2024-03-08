import { css, keyframes } from "@emotion/react";

const infiniteAnimation = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(-108rem, 0, 0);
  }

`;

export const ticker = css({
    display: "flex",
    "&:hover": { animationPlayState: "paused" },
    animation: `${infiniteAnimation} 18s linear infinite`,
});
