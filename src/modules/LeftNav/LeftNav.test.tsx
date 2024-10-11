import mockRouter from "next-router-mock";
import {
    render,
    /* within */
} from "@/utils/testUtils";
import LeftNav from "./LeftNav";

/* import { RouteName } from "@/consts/routeName"; */

describe("LeftNav", () => {
    it("renders the profile navigation item", () => {
        const { getByText, getAllByRole } = render(
            <LeftNav permissions={{ "cohort.read": false }} />
        );

        expect(getAllByRole("button")).toHaveLength(5);

        expect(getByText("Your Profile")).toBeInTheDocument();
    });
    it("renders the profile navigation with Cohort Admin", () => {
        mockRouter.push("/initial-path");

        const { getByText, getAllByRole } = render(
            <LeftNav permissions={{ "cohort.read": true }} />
        );

        expect(getAllByRole("button")).toHaveLength(6);

        expect(getByText("Your Profile")).toBeInTheDocument();
        expect(getByText("Cohort Discovery Admin")).toBeInTheDocument();
    });

    {
        /* it("renders expanded items", () => {
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
            />
        );

        const buttons = getAllByRole("button");
        expect(getAllByRole("button")).toHaveLength(5);

        expect(
            within(buttons[0]).getByText("Team Management")
        ).toBeInTheDocument();
        expect(
            within(buttons[1]).getByText("Integrations")
        ).toBeInTheDocument();
        expect(
            within(buttons[2]).getByText("Private apps")
        ).toBeInTheDocument();
        expect(
            within(buttons[3]).getByText("Gateway apps")
        ).toBeInTheDocument();
        expect(within(buttons[4]).getByText("Help")).toBeInTheDocument();
    }); */
    }
});
