import { KeyboardDoubleArrowDownIcon } from "@/consts/icons";
import Typography from "../Typography";
import { FlashyWrapper } from "./FlashyText.styles";

interface FlashyTextProps {
    text: string;
    color?: string;
    fill?: string;
}

const FlashyText = ({
    text,
    color = "white",
    fill = "white",
}: FlashyTextProps) => {
    return (
        <FlashyWrapper>
            <Typography color={color}>{text}</Typography>
            <KeyboardDoubleArrowDownIcon sx={{ fill }} />
        </FlashyWrapper>
    );
};

export default FlashyText;
