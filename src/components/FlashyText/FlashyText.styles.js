import { styled, keyframes } from "@mui/material";

const infiniteAnimation = keyframes`
  from { opacity: 0; } 
`;

export const FlashyWrapper = styled("div")({
    textAlign: "center",
    animation: `${infiniteAnimation} 1.5s infinite alternate`,
});
