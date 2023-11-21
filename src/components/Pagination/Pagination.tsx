import MuiPagination, {
    PaginationProps as MuiPaginationProps,
} from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { ArrowLeftIcon, ArrowRightIcon } from "@/consts/icons";

interface PaginationProps extends MuiPaginationProps {
    isLoading?: boolean;
}

const Pagination = ({ isLoading, ...rest }: PaginationProps) => {
    if (isLoading) return null;
    return (
        <MuiPagination
            renderItem={item => (
                <PaginationItem
                    data-testid="pagination-item"
                    slots={{ previous: ArrowLeftIcon, next: ArrowRightIcon }}
                    {...item}
                />
            )}
            {...rest}
        />
    );
};

Pagination.defaultProps = {
    isLoading: false,
};

export default Pagination;
