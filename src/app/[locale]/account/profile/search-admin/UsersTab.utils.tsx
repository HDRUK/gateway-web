import { IconButton, Skeleton, Tooltip } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/interfaces/User";
import Box from "@/components/Box";
import Chip from "@/components/Chip";
import Typography from "@/components/Typography";
import { GroupRemoveIcon, VisibilityOutlinedIcon } from "@/consts/icons";

interface GetColumnsProps {
    onDelete: (user: User) => void;
    onRemoveFromTeams: (user: User) => void;
    currentUserId?: number;
    ownedEntityCounts?: Record<number, number>;
    isLoadingOwnedEntityCounts?: boolean;
}

const getColumns = ({
    onDelete,
    onRemoveFromTeams,
    currentUserId,
    ownedEntityCounts,
    isLoadingOwnedEntityCounts,
}: GetColumnsProps): ColumnDef<User, unknown>[] => {
    return [
        {
            id: "name",
            header: () => <Box textAlign="left">Name</Box>,
            cell: ({ row: { original } }) => (
                <Typography>
                    {original.firstname
                        ? `${original.firstname} ${original.lastname}`
                        : original.name}
                </Typography>
            ),
        },
        {
            id: "email",
            header: () => <Box textAlign="left">Email</Box>,
            cell: ({ row: { original } }) => (
                <Typography color="GrayText">
                    {original.preferred_email || original.email}
                </Typography>
            ),
        },
        {
            id: "role",
            header: () => <Box textAlign="left">Role</Box>,
            cell: ({ row: { original } }) =>
                original.is_admin ? (
                    <Chip label="Super-user" color="primary" size="small" />
                ) : (
                    <Chip label="User" size="small" />
                ),
        },
        {
            id: "teams",
            header: () => <Box textAlign="left">Teams</Box>,
            cell: ({ row: { original } }) => (
                <Typography>{original.teams?.length ?? 0}</Typography>
            ),
        },
        {
            id: "ownedEntities",
            header: () => <Box textAlign="left">Owned entities</Box>,
            cell: ({ row: { original } }) => {
                if (isLoadingOwnedEntityCounts) {
                    return <Skeleton width={24} />;
                }

                return (
                    <Typography>
                        {ownedEntityCounts?.[original.id] ?? 0}
                    </Typography>
                );
            },
        },
        {
            id: "actions",
            header: () => <Box textAlign="left">Actions</Box>,
            size: 60,
            cell: ({ row: { original } }) => {
                const isSelf = original.id === currentUserId;
                const hasTeams = (original.teams?.length ?? 0) > 0;

                return (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip
                            title={
                                isSelf
                                    ? "You cannot delete your own account"
                                    : "Review and delete user"
                            }>
                            <span>
                                <IconButton
                                    color="primary"
                                    aria-label={`Review and delete ${original.name}`}
                                    disabled={isSelf}
                                    onClick={() => onDelete(original)}>
                                    <VisibilityOutlinedIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        {original.is_admin && (
                            <Tooltip
                                title={
                                    hasTeams
                                        ? "Remove from teams"
                                        : "Not a member of any teams"
                                }>
                                <span>
                                    <IconButton
                                        color="primary"
                                        aria-label={`Remove ${original.name} from teams`}
                                        disabled={!hasTeams}
                                        onClick={() =>
                                            onRemoveFromTeams(original)
                                        }>
                                        <GroupRemoveIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                    </Box>
                );
            },
        },
    ];
};

export { getColumns };
