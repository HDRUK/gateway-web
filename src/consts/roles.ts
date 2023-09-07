const ROLE_CUSTODIAN_DEVELOPER = "developer";
const ROLE_CUSTODIAN_TEAM_ADMIN = "custodian.team.admin";
const ROLE_CUSTODIAN_METADATA_MANAGER = "custodian.metadata.manager";
const ROLE_CUSTODIAN_METADATA_EDITOR = "metadata_editor";
const ROLE_CUSTODIAN_DAR_MANAGER = "custodian.dar.manager";
const ROLE_CUSTODIAN_DAR_REVIEWER = "reviewer";

const ROLE_HDRUK_ADMIN = "hdruk.admin";
const ROLE_HDRUK_SUPERADMIN = "hdruk.superadmin";
const ROLE_HDRUK_METADATA = "hdruk.metadata";
const ROLE_HDRUK_DAR = "hdruk.dar";
const ROLE_HDRUK_CUSTODIAN = "hdruk.custodian";

const rolesMeta: {
    [key: string]: {
        label: string;
        permissions: string[];
        tooltipLabel: string;
        tooltipDescription: string;
    };
} = {
    [ROLE_CUSTODIAN_DEVELOPER]: {
        label: "Developer",
        permissions: [],
        tooltipLabel: "Developers",
        tooltipDescription:
            " can; develop things, this is placeholder text, copy to be added.",
    },
    [ROLE_CUSTODIAN_TEAM_ADMIN]: {
        label: "Admin",
        permissions: [],
        tooltipLabel: "Admins",
        tooltipDescription:
            " can; manage the existing members of your team, add new members, manage the teams notifications preferences like adding and editing the team email address.",
    },
    [ROLE_CUSTODIAN_METADATA_MANAGER]: {
        label: "Manager",
        permissions: [],
        tooltipLabel: "Managers",
        tooltipDescription:
            " can; manage members, add, edit and archive metadata.",
    },
    [ROLE_CUSTODIAN_METADATA_EDITOR]: {
        label: "Editor",
        permissions: [],
        tooltipLabel: "Metadata editors",
        tooltipDescription: " can; add/edit and archive metadata.",
    },
    [ROLE_CUSTODIAN_DAR_MANAGER]: {
        label: "Manager",
        permissions: [],
        tooltipLabel: "Managers",
        tooltipDescription:
            " can; manage members, create and assign workflows and make the final decision on data access request applications.",
    },
    [ROLE_CUSTODIAN_DAR_REVIEWER]: {
        label: "Reviewer",
        permissions: [],
        tooltipLabel: "Reviewers",
        tooltipDescription:
            " can; review applications that are assigned to them.",
    },
};

export {
    rolesMeta,
    ROLE_CUSTODIAN_DEVELOPER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_METADATA_EDITOR,
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_DAR_REVIEWER,
    ROLE_HDRUK_ADMIN,
    ROLE_HDRUK_SUPERADMIN,
    ROLE_HDRUK_METADATA,
    ROLE_HDRUK_DAR,
    ROLE_HDRUK_CUSTODIAN,
};
