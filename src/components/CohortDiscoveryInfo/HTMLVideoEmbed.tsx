"use client";

import { Box } from "@mui/material";
import HTMLContent from "@/components/HTMLContent";
import {
    IFRAME_EMBED_MAX_WIDTH,
    IFrameWrapper,
} from "@/styles/IFrameContainer.styles";

// Renders a CMS video embed (expected to be a bare <iframe>, e.g. YouTube's
// default share embed) inside a responsive 16:9 frame.
const HTMLVideoEmbed = ({ content }: { content?: string }) => {
    if (!content) {
        return null;
    }

    return (
        <Box
            sx={{
                mx: "auto",
                width: "100%",
                maxWidth: IFRAME_EMBED_MAX_WIDTH,
            }}>
            <IFrameWrapper>
                <HTMLContent content={content} />
            </IFrameWrapper>
        </Box>
    );
};

export default HTMLVideoEmbed;
