import Box from "@/components/Box";
import Chip from "@/components/Chip";
import Typography from "@/components/Typography";
import { RendererProps } from "../../types";
import { isEmptyValue } from "../../utils/isEmptyValue";
import {
    isDelimitedList,
    splitDelimitedList,
} from "../../utils/splitDelimitedList";

const MAX_CHIP_WIDTH = 320;

const toItems = (value: unknown): string[] => {
    if (isDelimitedList(value)) return splitDelimitedList(value);
    if (Array.isArray(value)) {
        return value.filter(item => !isEmptyValue(item)).map(String);
    }
    return [String(value)];
};

/**
 * Chips separate one value from the next, so a list of one has nothing to
 * separate - it reads as the plain value it is.
 */
const ValueChips = ({ value }: RendererProps) => {
    const items = toItems(value);

    if (!items.length) return null;
    if (items.length === 1) return <Typography>{items[0]}</Typography>;

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, p: 0 }}>
            {items.map(item => (
                <Chip
                    key={item}
                    label={item}
                    title={item}
                    size="small"
                    sx={{
                        maxWidth: MAX_CHIP_WIDTH,
                        "& .MuiChip-label": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        },
                    }}
                />
            ))}
        </Box>
    );
};

export default ValueChips;
