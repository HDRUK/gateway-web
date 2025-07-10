import { Button, ButtonProps, SxProps } from "@mui/material";
import { useTranslations } from "next-intl";
import { ArrowDropDownIcon } from "@/consts/icons";

export interface ShowMoreButtonProps extends Omit<ButtonProps, "onClick"> {
    open?: boolean;
    sxButton?: SxProps;
    onClick: (open: boolean) => void;
}

export default function ShowMoreButton({
    open,
    sxButton,
    onClick,
}: ShowMoreButtonProps) {
    const t = useTranslations("components.ShowMore");

    return (
        <Button
            style={{ whiteSpace: "nowrap" }}
            size="small"
            onClick={() => onClick?.(!open)}
            endIcon={
                <ArrowDropDownIcon
                    fontSize="large"
                    sx={{
                        transform: `rotate(${open ? 180 : 0}deg)`,
                    }}
                    color="primary"
                />
            }
            variant="link"
            sx={sxButton}>
            {open ? t("showLess") : t("showMore")}
        </Button>
    );
}
