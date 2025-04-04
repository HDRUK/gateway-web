import type { Meta, StoryObj } from "@storybook/react";
import {
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_DAR_REVIEWER,
    ROLE_CUSTODIAN_DEVELOPER,
    ROLE_CUSTODIAN_METADATA_EDITOR,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
} from "@/consts/roles";
import PermissionDescriptions from "./PermissionDescriptions";

const meta: Meta<typeof PermissionDescriptions> = {
    component: PermissionDescriptions,
    title: "Modules/PermissionDescriptions",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PermissionDescriptions>;

export const Default: Story = {
    args: {
        roles: [
            ROLE_CUSTODIAN_DAR_MANAGER,
            ROLE_CUSTODIAN_DAR_REVIEWER,
            ROLE_CUSTODIAN_DEVELOPER,
            ROLE_CUSTODIAN_TEAM_ADMIN,
            ROLE_CUSTODIAN_METADATA_MANAGER,
            ROLE_CUSTODIAN_METADATA_EDITOR,
        ],
    },
};
