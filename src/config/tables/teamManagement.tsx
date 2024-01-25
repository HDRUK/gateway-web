import { ColumnDef } from "@tanstack/react-table";
import { Team } from "@/interfaces/Team";
import ActionMenu from "@/components/ActionMenu";
import Box from "@/components/Box";
import FilterPopover from "@/components/FilterPopover";
import ShowMoreTooltip from "@/components/ShowMoreTooltip";
import SortIcon from "@/components/SortIcon";
import TickCrossIcon from "@/components/TickCrossIcon";
import { CloseIcon, EditIcon } from "@/consts/icons";
import { formatDate } from "@/utils/date";
import { capitalise } from "@/utils/general";
import { getTeamAdmins } from "@/utils/user";

interface getColumnsProps {
    sort: { key: string; direction: string };
    setSort: (sort: { key: string; direction: string }) => void;
    translations: { [key: string]: string };
    permissions: { [key: string]: boolean };
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
    setQuestionBankStatus: (status: "true" | "false") => void;
    questionBankStatus?: "true" | "false";
}

const getColumns = ({
    setSort,
    sort,
    translations,
    permissions,
    handleEdit,
    handleDelete,
    setQuestionBankStatus,
    questionBankStatus,
}: getColumnsProps): ColumnDef<Team>[] => {
    return [
        {
            id: "updated_at",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    {translations.lastUpdated}
                    <SortIcon
                        setSort={setSort}
                        sort={sort}
                        sortKey="updated_at"
                        ariaLabel={translations.lastUpdated}
                    />
                </Box>
            ),
            accessorFn: row => `${formatDate(row.updated_at)}`,
        },
        {
            id: "name",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    {translations.dataProvider}
                    <SortIcon
                        setSort={setSort}
                        sort={sort}
                        sortKey="data_provider"
                        ariaLabel={translations.dataProvider}
                    />
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
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    {translations.questionBank}
                    <FilterPopover<"true" | "false">
                        name="is_question_bank"
                        radios={[
                            { value: "", label: translations.all },
                            { value: "true", label: translations.enabled },
                            {
                                value: "false",
                                label: translations.disabled,
                            },
                        ]}
                        setFilter={setQuestionBankStatus}
                        filter={questionBankStatus}
                    />
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
