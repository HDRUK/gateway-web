import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Box from "@/components/Box";

type SortableItemProps = {
    children: React.ReactNode;
    itemId: number | string;
};

const SortableItem = React.memo(({ children, itemId }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: itemId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Box
                sx={{
                    p: 0,
                    m: 0,
                    mb: 2,
                }}
                key={itemId}>
                {children}
            </Box>
        </div>
    );
});

export default SortableItem;
