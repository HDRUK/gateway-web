import MuiPagination from "@mui/material/Pagination";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import PaginationItem from "@mui/material/PaginationItem";

interface PaginationProps {
    count: number;
    variant: "outlined" | "text";
    shape: "circular" | "rounded";
    onChange: (_: unknown, page: number) => void;
}

const Pagination = (props: PaginationProps) => {
    return (
        <MuiPagination
            renderItem={item => (
                <PaginationItem
                    slots={{ previous: ArrowLeftIcon, next: ArrowRightIcon }}
                    {...item}
                />
            )}
            {...props}
        />
    );
};

export default Pagination;
