import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Team } from "@/interfaces/Team";
import ActionMenu from "@/components/ActionMenu";
import Box from "@/components/Box";
import FilterPopover from "@/components/FilterPopover";
import { MarkDownSanitzedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
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
    handleDelete: (id: number, teamName: string) => void;
    setQuestionBankStatus: (status: string) => void;
    questionBankStatus?: "true" | "false";
}

const columnHelper = createColumnHelper<Team>();

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
        columnHelper.display({
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
            cell: ({ row: { original } }) =>
                `${formatDate(original.updated_at)}`,
        }),
        columnHelper.display({
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
            cell: ({ row: { original } }) => (
                <MarkDownSanitzedWithHtml
                    content={`${capitalise(original.member_of)} > ${
                        original.name
                    }`}
                    WrapperComponent="span"
                />
            ),
        }),
        columnHelper.display({
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
        }),
        columnHelper.display({
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
                    <FilterPopover
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
        }),
        ...(permissions["custodians.update"]
            ? [
                  columnHelper.display({
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
                                              handleDelete(
                                                  original.id,
                                                  original.name
                                              ),
                                      },
                                  ]}
                              />
                          </div>
                      ),
                  }),
              ]
            : []),
    ];
};

export { getColumns };
