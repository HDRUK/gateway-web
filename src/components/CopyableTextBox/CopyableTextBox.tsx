import { copyToClipboard } from "@/utils/general";
import Typography from "@/components/Typography";
import { ContentCopyIcon } from "@/consts/icons";
import { IconButton } from "@mui/material";
import theme from "@/config/theme";

export interface CopyableTextBoxProps {
    content: string | undefined;
}

const CopyableTextBox = (props: CopyableTextBoxProps) => {
    const {
        content
    } = props;

    return (
        <Typography
            sx={{
                marginTop: "10px",
                padding: 2,
                backgroundColor: theme.palette.grey[200],
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                {content}
                <IconButton
                disableRipple
                size="large"
                edge="start"
                aria-label="copy text"
                onClick={() => copyToClipboard(content)}>
                    <ContentCopyIcon />
                </IconButton>

        </Typography>
    );
};

CopyableTextBox.defaultProps = {
    content: ""
};

export default CopyableTextBox;
