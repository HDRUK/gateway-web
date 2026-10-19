import Box from "@/components/Box";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import { escapeMarkdownUnderscores } from "@/utils/dataset";

export interface ProseProps {
    field: string;
    data?: Record<string, unknown>;
}

/**
 * One field as an unlabelled paragraph - how the production page shows the
 * abstract at the top of Summary.
 */
const Prose = ({ field, data }: ProseProps) => {
    const value = data?.[field];

    if (typeof value !== "string" || !value) return null;

    return (
        <Box sx={{ p: 0, pb: 2 }}>
            <MarkDownSanitizedWithHtml
                content={escapeMarkdownUnderscores(value)}
                wrapper="span"
            />
        </Box>
    );
};

export default Prose;
