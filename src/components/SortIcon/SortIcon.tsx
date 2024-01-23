import { IconButton } from "@mui/material";
import { IconType } from "@/interfaces/Ui";
import { ArrowDropUpIcon } from "@/consts/icons";

const updateSort =
    (key: string) => (prev: { key: string; direction: string }) => ({
        ...prev,
        key,
        direction:
            prev.key === key
                ? prev.direction === "asc"
                    ? "desc"
                    : "asc"
                : "asc",
    });

interface SortIconProps {
    sortKey: string;
    sort: { key: string; direction: string };
    setSort: (sort: { key: string; direction: string }) => void;
    ariaLabel: string;
    icon: IconType;
}

const SortIcon = ({
    sort,
    sortKey,
    setSort,
    ariaLabel,
    icon,
}: SortIconProps) => {
    const Icon = icon || ArrowDropUpIcon;
    return (
        <IconButton
            sx={{ p: 0 }}
            disableRipple
            size="large"
            edge="start"
            aria-label={ariaLabel}
            onClick={() => setSort(updateSort(sortKey))}>
            <Icon
                sx={{
                    transform: `rotate(${
                        sort.key === sortKey && sort.direction !== "asc"
                            ? 180
                            : 0
                    }deg)`,
                }}
            />
        </IconButton>
    );
};

export default SortIcon;
