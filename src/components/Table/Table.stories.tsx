import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Box from "@/components/Box";
import TooltipIcon from "@/components/TooltipIcon";
import PermissionDescriptions from "@/modules/PermissionDescriptions";
import { DeleteForeverIcon } from "@/consts/icons";
import {
    ROLE_CUSTODIAN_DEVELOPER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
} from "@/consts/roles";
import TableActionCell from "@/app/[locale]/account/team/[teamId]/(withLeftNav)/team-management/components/TableActionCell";
import { userV1 } from "@/mocks/data";
import Table from "./Table";

/** Tanstack documentation: https://tanstack.com/table/v8 */

const meta: Meta<typeof Table> = {
    component: Table,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Table>;

const columnHelper = createColumnHelper<{
    firstname: string;
    lastname: string;
}>();

const columns: ColumnDef<{ firstname: string; lastname: string }>[] = [
    columnHelper.display({
        id: "Name",
        cell: ({ row }) => `${row.original.firstname} ${row.original.lastname}`,
    }),
    columnHelper.display({
        id: "team",
        header: () => (
            <TooltipIcon
                label="Team"
                content={
                    <PermissionDescriptions
                        roles={[
                            ROLE_CUSTODIAN_TEAM_ADMIN,
                            ROLE_CUSTODIAN_DEVELOPER,
                        ]}
                    />
                }
            />
        ),
        cell: () => null,
    }),
    columnHelper.display({
        id: "furtherActions",
        header: () => <Box textAlign="left">Actions</Box>,
        size: 40,
        cell: ({ row: { original } }) => {
            return (
                <TableActionCell
                    user={userV1}
                    actions={[
                        {
                            label: "Delete user",
                            icon: DeleteForeverIcon,
                            onClick: () =>
                                console.log(`${original.firstname} clicked`),
                        },
                    ]}
                />
            );
        },
    }),
];

export const Default: Story = {
    args: {
        columns,
        rows: [
            { id: 1, firstname: userV1.firstname, lastname: userV1.lastname },
            {
                id: 2,
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
            },
            {
                id: 3,
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
            },
        ],
    },
};
