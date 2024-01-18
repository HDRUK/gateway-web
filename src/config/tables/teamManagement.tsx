import { ColumnDef } from "@tanstack/react-table";
import { Team } from "@/interfaces/Team";
import ActionMenu from "@/components/ActionMenu";
import Box from "@/components/Box";
import ShowMoreTooltip from "@/components/ShowMoreTooltip";
import TickCrossIcon from "@/components/TickCrossIcon";
import { CloseIcon, EditIcon } from "@/consts/icons";
import { formatDate } from "@/utils/date";
import { capitalise } from "@/utils/general";
import { getTeamAdmins } from "@/utils/user";

const getColumns = (
    permissions: { [key: string]: boolean },
    actions: {
        handleEdit: (id: number) => void;
        handleDelete: (id: number) => void;
    }
): ColumnDef<Team>[] => {
    return [
        {
            id: "application_form_updated_on",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    Last updated
                </Box>
            ),
            accessorFn: row => `${formatDate(row.application_form_updated_on)}`,
        },
        {
            id: "name",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    Data provider
                </Box>
            ),
            accessorFn: row => `${capitalise(row.member_of)} > ${row.name}`,
        },
        {
            id: "teamManagers",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    Team admin(s)
                </Box>
            ),
            cell: ({ row: { original } }) => {
                if (!original.users) return null;
                const admins = getTeamAdmins(original.users);
                return <ShowMoreTooltip items={admins} />;
            },
        },
        {
            id: "questionBank",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    Question Bank
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <div style={{ textAlign: "center" }}>
                    <TickCrossIcon isTrue={original.is_question_bank} />
                </div>
            ),
        },
        ...(permissions["custodians.update"]
            ? [
                  {
                      id: "actions",
                      header: () => (
                          <Box sx={{ p: 0 }} textAlign="left">
                              Action
                          </Box>
                      ),
                      cell: ({ row: { original } }) => (
                          <div style={{ textAlign: "center" }}>
                              <ActionMenu
                                  actions={[
                                      {
                                          label: "Edit",
                                          icon: EditIcon,
                                          action: () =>
                                              actions.handleEdit(original.id),
                                      },
                                      {
                                          label: "Delete",
                                          icon: CloseIcon,
                                          action: () =>
                                              actions.handleDelete(original.id),
                                      },
                                  ]}
                              />
                          </div>
                      ),
                  },
              ]
            : []),
    ];
};

export { getColumns };
