const protectedRoutes = [
    {
        route: "/account/team/*/datasets",
        permissions: ["fe.account.nav.datasets"],
    },
    {
        route: "/account/team/*/data-access-requests/applications",
        permissions: ["fe.account.nav.dar.applications"],
    },
    {
        route: "/account/team/*/data-access-requests/workflows",
        permissions: ["fe.account.nav.dar.workflows"],
    },
    {
        route: "/account/team/*/data-access-requests/edit-form",
        permissions: ["fe.account.nav.dar.editForm"],
    },
    {
        route: "/account/team/*/data-uses*",
        permissions: ["fe.account.nav.dur"],
    },
    {
        route: "/account/team/*/integrations/api-management*",
        permissions: ["fe.account.nav.integrations.api-management"],
    },
    {
        route: "/account/team/*/integrations/integration*",
        permissions: ["fe.account.nav.integrations.integration"],
    },
];

export default protectedRoutes;
