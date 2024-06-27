import { DeleteForeverIcon } from "@/consts/icons";

interface DeleteActionProps {
    onDelete: () => void;
}

export default function DeleteAction({ onDelete }: DeleteActionProps) {
    return (
        <DeleteForeverIcon
            color="primary"
            onClick={onDelete}
            role="button"
            sx={{
                cursor: "pointer",
            }}
        />
    );
}
