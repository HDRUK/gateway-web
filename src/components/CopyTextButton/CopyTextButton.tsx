import Typography from "@/components/Typography";
import { IconButton } from "@mui/material";
import theme from "@/config/theme";
import notificationService from "@/services/notification";
import { ContentCopyIcon } from "@/consts/icons";

export interface CopyTextButtonProps {
    content: string | undefined;
}

const copyToClipboard = (str: string | undefined) => {
    navigator.clipboard.writeText(str || "");

    // note: "Copied to clipboard" would better?
    notificationService.success("Link copied");
};

const CopyTextButton = (props: CopyTextButtonProps) => {
    const { content } = props;

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

export default CopyTextButton;
