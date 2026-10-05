import { IconButton } from "@mui/material";
import { IconType } from "@/interfaces/Ui";
import { ArrowDropUpIcon } from "@/consts/icons";
import { SortDirection } from "@/consts/sort";

const updateSort = (
    key: string,
    sort: { key: string; direction: SortDirection }
) => ({
    key,
    direction:
        sort.key === key
            ? sort.direction === SortDirection.ASC
                ? SortDirection.DESC
                : SortDirection.ASC
            : SortDirection.ASC,
});

interface SortIconProps {
    sortKey: string;
    sort: { key: string; direction: SortDirection };
    setSort: (sort: { key: string; direction: SortDirection }) => void;
    ariaLabel: string;
    icon?: IconType;
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
            sx={{ p: 0, marginLeft: 1 }}
            disableRipple
            size="large"
            edge="start"
            aria-label={ariaLabel}
            onClick={() => setSort(updateSort(sortKey, sort))}>
            <Icon
                sx={{
                    transform: `rotate(${
                        sort.key === sortKey &&
                        sort.direction !== SortDirection.ASC
                            ? 180
                            : 0
                    }deg)`,
                }}
            />
        </IconButton>
    );
};

export default SortIcon;
