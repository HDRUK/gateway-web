import type { Meta, StoryObj } from "@storybook/react";
import { ColumnDef } from "@tanstack/react-table";
import { userV1 } from "@/mocks/data";
import PermissionDescriptions from "@/modules/PermissionDescriptions";
import {
    ROLE_CUSTODIAN_DEVELOPER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
} from "@/consts/roles";
import { DeleteForeverIcon } from "@/consts/icons";
import { faker } from "@faker-js/faker";
import TableActionCell from "@/components/TableActionCell";
import TableTooltipCell from "@/components/TableTooltipCell";
import Box from "@/components/Box";
import Table from "./Table";

/** Tanstack documentation: https://tanstack.com/table/v8 */

const meta: Meta<typeof Table> = {
    component: Table,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Table>;

const columns: ColumnDef<{ firstname: string; lastname: string }>[] = [
    { id: "Name", accessorFn: row => `${row.firstname} ${row.lastname}` },
    {
        id: "team",
        header: () => (
            <TableTooltipCell
                header="Team"
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
    },
    {
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
                            icon: <DeleteForeverIcon />,
                            onClick: () =>
                                console.log(`${original.id} clicked`),
                        },
                    ]}
                />
            );
        },
    },
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
