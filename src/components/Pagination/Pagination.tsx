import { Box } from "@mui/material";
import MuiPagination, {
    PaginationProps as MuiPaginationProps,
} from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { ArrowLeftIcon, ArrowRightIcon } from "@/consts/icons";

interface PaginationProps extends MuiPaginationProps {
    isLoading?: boolean;
}

const Pagination = ({ isLoading = false, ...rest }: PaginationProps) => {
    if (isLoading) return null;
    return (
        <Box sx={{ p: 0, display: "flex", justifyContent: "center" }}>
            <MuiPagination
                renderItem={item => (
                    <PaginationItem
                        data-testid="pagination-item"
                        slots={{
                            previous: ArrowLeftIcon,
                            next: ArrowRightIcon,
                        }}
                        {...item}
                    />
                )}
                {...rest}
            />
        </Box>
    );
};

export default Pagination;
