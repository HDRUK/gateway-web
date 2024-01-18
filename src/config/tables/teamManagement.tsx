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

const getColumns = ({
    translations,
    permissions,
    handleEdit,
    handleDelete,
}: {
    translations: { [key: string]: string };
    permissions: { [key: string]: boolean };
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
}): ColumnDef<Team>[] => {
    return [
        {
            id: "application_form_updated_on",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    {translations.lastUpdated}
                </Box>
            ),
            accessorFn: row => `${formatDate(row.application_form_updated_on)}`,
        },
        {
            id: "name",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    {translations.dataProvider}
                </Box>
            ),
            accessorFn: row => `${capitalise(row.member_of)} > ${row.name}`,
        },
        {
            id: "teamManagers",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    {translations.teamAdmins}
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
                    {translations.questionBank}
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
                              {translations.action}
                          </Box>
                      ),
                      cell: ({ row: { original } }) => (
                          <div style={{ textAlign: "center" }}>
                              <ActionMenu
                                  actions={[
                                      {
                                          label: "Edit",
                                          icon: EditIcon,
                                          action: () => handleEdit(original.id),
                                      },
                                      {
                                          label: "Delete",
                                          icon: CloseIcon,
                                          action: () =>
                                              handleDelete(original.id),
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
