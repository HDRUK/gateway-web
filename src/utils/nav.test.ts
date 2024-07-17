import { RouteName } from "@/consts/routeName";
import { getTeamNav } from "./nav";

describe("Nav utils", () => {
    describe("getTeamNav", () => {
        const teamId = "123";

        it("should include Team Management item with href", () => {
            const navItems = getTeamNav({}, teamId);
            const teamManagementItem = navItems.find(
                item => item.label === "Team Management"
            );

            expect(teamManagementItem).toBeDefined();
            expect(teamManagementItem?.href).toBe(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/123/${RouteName.TEAM_MANAGEMENT}`
            );
        });

        it("should include Datasets item", () => {
            const navItems = getTeamNav({ "datasets.read": true }, teamId);
            const datasetsItem = navItems.find(
                item => item.label === "Datasets"
            );

            expect(datasetsItem).toBeDefined();
            expect(datasetsItem?.href).toBe(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/123/${RouteName.DATASETS}`
            );
        });

        it("should include Data Access Requests Applications item", () => {
            const navItems = getTeamNav({ "dar.read.assigned": true }, teamId);
            const darItem = navItems.find(
                item => item.label === "Data Access Requests"
            );

            expect(darItem).toBeDefined();
            expect(darItem?.subItems).toBeDefined();

            const applicationsItem = darItem?.subItems?.find(
                item => item.label === "Applications"
            );
            expect(applicationsItem).toBeDefined();
            expect(applicationsItem?.href).toBe(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/123/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.APPLICATIONS}`
            );
        });
        it("should include Data Access Requests Workflows item", () => {
            const navItems = getTeamNav({ "workflows.read": true }, teamId);
            const darItem = navItems.find(
                item => item.label === "Data Access Requests"
            );

            expect(darItem).toBeDefined();
            expect(darItem?.subItems).toBeDefined();

            const workflowsItem = darItem?.subItems?.find(
                item => item.label === "Workflows"
            );

            expect(workflowsItem).toBeDefined();
            expect(workflowsItem?.href).toBe(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/123/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.WORKFLOWS}`
            );
        });
        it("should include Data Access Requests Edit form", () => {
            const navItems = getTeamNav({ "dar-form.update": true }, teamId);
            const darItem = navItems.find(
                item => item.label === "Data Access Requests"
            );

            expect(darItem).toBeDefined();
            expect(darItem?.subItems).toBeDefined();

            const editFormItem = darItem?.subItems?.find(
                item => item.label === "Manage Templates"
            );

            expect(editFormItem).toBeDefined();
            expect(editFormItem?.href).toBe(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/123/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.DAR_TEMPLATES}`
            );
        });

        it("should include Data Uses item", () => {
            const navItems = getTeamNav({ "dur.read": true }, teamId);
            const dataUsesItem = navItems.find(
                item => item.label === "Data Uses"
            );

            expect(dataUsesItem).toBeDefined();
            expect(dataUsesItem?.href).toBe(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/123/${RouteName.DATA_USES}`
            );
        });

        it("should include API management", () => {
            const navItems = getTeamNav({ "applications.read": true }, teamId);
            const integrationsItem = navItems.find(
                item => item.label === "Integrations"
            );

            expect(integrationsItem).toBeDefined();
            expect(integrationsItem?.subItems).toBeDefined();

            const apiManagementItem = integrationsItem?.subItems?.find(
                item => item.label === "Private Apps"
            );

            expect(apiManagementItem).toBeDefined();
            expect(apiManagementItem?.href).toBe(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/123/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}`
            );
        });

        it("should include Integrations", () => {
            const navItems = getTeamNav(
                { "integrations.metadata": true, "integrations.dar": true },
                teamId
            );
            const integrationsItem = navItems.find(
                item => item.label === "Integrations"
            );

            expect(integrationsItem).toBeDefined();
            expect(integrationsItem?.subItems).toBeDefined();

            const integrationItem = integrationsItem?.subItems?.find(
                item => item.label === "Integration"
            );

            expect(integrationItem).toBeDefined();
            expect(integrationItem?.href).toBe(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/123/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}`
            );
        });

        it("should include Help item", () => {
            const navItems = getTeamNav({}, teamId);
            const helpItem = navItems.find(item => item.label === "Help");

            expect(helpItem).toBeDefined();
            expect(helpItem?.href).toBe(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/123/${RouteName.HELP}`
            );
        });
    });
});
