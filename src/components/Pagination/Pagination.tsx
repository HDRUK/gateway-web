import MuiPagination, {
    PaginationProps as MuiPaginationProps,
} from "@mui/material/Pagination";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import PaginationItem from "@mui/material/PaginationItem";

interface PaginationProps extends MuiPaginationProps {
    isLoading: boolean;
}

const Pagination = ({
    isLoading,
    variant = "outlined",
    shape = "rounded",
    ...rest
}: PaginationProps) => {
    if (isLoading) return null;
    return (
        <MuiPagination
            renderItem={item => (
                <PaginationItem
                    slots={{ previous: ArrowLeftIcon, next: ArrowRightIcon }}
                    {...item}
                />
            )}
            variant={variant}
            shape={shape}
            {...rest}
        />
    );
};

export default Pagination;
