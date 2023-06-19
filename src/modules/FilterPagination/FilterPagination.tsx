import { Filter } from "@/interfaces/Filter";
import useGet from "@/hooks/useGet";
import Button from "@/components/Button";
import Loading from "@/components/Loading";

interface FilterPaginationProps {
    pageUrl: string;
    onUpdate?: (id: number) => void;
    onDelete?: (id: number) => void;
}

function FilterPagination({
    pageUrl,
    onUpdate,
    onDelete,
}: FilterPaginationProps) {
    const { data, isLoading } = useGet<{
        lastPage: number;
        list: Filter[];
    }>(pageUrl, {
        withPagination: true,
    });

    const { list } = data || {};

    const handleUpdate = (id: number) => {
        if (typeof onUpdate === "function") {
            onUpdate(id);
        }
    };

    const handleDelete = (id: number) => {
        if (typeof onDelete === "function") {
            onDelete(id);
        }
    };

    if (isLoading) return <Loading />;

    return (
        <ul style={{ marginLeft: "20px", height: "auto" }}>
            {list?.map(filter => (
                <li key={filter.id} style={{ marginBottom: "10px" }}>
                    {filter.type}{" "}
                    <Button
                        variant="text"
                        color="primary"
                        size="small"
                        sx={{ margin: "0 5px" }}
                        onClick={() => handleUpdate(filter.id)}>
                        Change filter
                    </Button>
                    <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={() => handleDelete(filter.id)}>
                        Delete
                    </Button>
                </li>
            ))}
        </ul>
    );
}

FilterPagination.defaultProps = {
    onUpdate: () => null,
    onDelete: () => null,
};

export default FilterPagination;
