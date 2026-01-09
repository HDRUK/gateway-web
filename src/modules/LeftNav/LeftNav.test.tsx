import mockRouter from "next-router-mock";
import { RouteName } from "@/consts/routeName";
import { render, within } from "@/utils/testUtils";
import LeftNav from "./LeftNav";

describe("LeftNav", () => {
    it("renders the profile navigation item", () => {
        const { getByText, getAllByRole } = render(
            <LeftNav
                permissions={{ "cohort.read": false }}
                initialLeftNavOpen={true}
            />
        );

        expect(getAllByRole("link")).toHaveLength(6);
        expect(getByText("Your Profile")).toBeInTheDocument();
    });

    it("renders the profile navigation with Cohort Admin", () => {
        mockRouter.push("/initial-path");

        const { getByText, getAllByRole } = render(
            <LeftNav
                permissions={{ "cohort.read": true }}
                initialLeftNavOpen={true}
            />
        );

        expect(getAllByRole("link")).toHaveLength(7);
        expect(getByText("Your Profile")).toBeInTheDocument();
        expect(getByText("Cohort Discovery Admin")).toBeInTheDocument();
    });

    it("renders expanded items", () => {
        mockRouter.push(
            `/en/${RouteName.ACCOUNT}/${RouteName.TEAM}/1/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}`
        );

        const { getAllByRole } = render(
            <LeftNav
                teamId="1"
                permissions={{
                    "roles.read": true,
                    "applications.read": true,
                    "integrations.metadata": true,
                    "integrations.dar": true,
                }}
                initialLeftNavOpen={true}
            />
        );

        const links = getAllByRole("link");
        expect(links).toHaveLength(4);

        expect(within(links[0]).getByText("Team members")).toBeInTheDocument();
        expect(
            within(links[1]).getByText("Custom Integrations")
        ).toBeInTheDocument();
        expect(
            within(links[2]).getByText("Predefined Integrations")
        ).toBeInTheDocument();
        expect(within(links[3]).getByText("Help")).toBeInTheDocument();
    });

    it("renders can expand", () => {

        const { getByText } = render(
            <LeftNav
                teamId="1"
                permissions={{ "cohort.read": false }}
                initialLeftNavOpen={true}
                initialExpandLeftNav={true}
            />
        );

        expect(getByText("Your Profile")).toBeInTheDocument();
        expect(getByText("Library")).toBeInTheDocument();
    });

    it("renders can collapse", () => {

        const { getByText } = render(
            <LeftNav
                teamId="1"
                permissions={{ "cohort.read": false }}
                initialLeftNavOpen={true}
                initialExpandLeftNav={false}
            />
        );

        expect(getByText("Your Profile")).toBeInTheDocument();
        expect(getByText("Library")).not.toBeInTheDocument();
    });
});
