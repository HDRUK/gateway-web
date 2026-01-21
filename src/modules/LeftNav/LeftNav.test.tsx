import Cookies from "js-cookie";
import mockRouter from "next-router-mock";
import config from "@/config/config";
import { RouteName } from "@/consts/routeName";
import { fireEvent, render, within } from "@/utils/testUtils";
import LeftNav from "./LeftNav";

jest.mock("js-cookie", () => ({
    set: jest.fn(),
}));

describe("LeftNav", () => {
    it("renders the profile navigation item", () => {
        const { getByText, getAllByRole } = render(
            <LeftNav
                permissions={{ "cohort.read": false }}
                initialLeftNavOpen={true}
                initialExpandLeftNavOnMobile={true}
            />
        );

        const links = getAllByRole("link");
        console.log(links);
        expect(links).toHaveLength(6);
        expect(getByText("Your Profile")).toBeInTheDocument();
    });

    it("renders the profile navigation with Cohort Admin", () => {
        mockRouter.push("/initial-path");

        const { getByText, getAllByRole } = render(
            <LeftNav
                permissions={{ "cohort.read": true }}
                initialLeftNavOpen={true}
                initialExpandLeftNavOnMobile={true}
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
                initialExpandLeftNavOnMobile={true}
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
        jest.mock('@mui/material/useMediaQuery', () => () => true);
        const { getByText } = render(
            <LeftNav
                permissions={{ "cohort.read": false }}
                initialLeftNavOpen={true}
                initialExpandLeftNavOnMobile={true}
            />
        );

        expect(getByText("Your Profile")).toBeInTheDocument();
        expect(getByText("Library")).toBeInTheDocument();
    });

    it("renders can collapse", () => {
        jest.mock('@mui/material/useMediaQuery', () => () => true);
        const { getByText } = render(
            <LeftNav
                permissions={{ "cohort.read": false }}
                initialLeftNavOpen={true}
                initialExpandLeftNavOnMobile={false}
            />
        );

        expect(getByText("Your Profile")).toBeInTheDocument();
        expect(getByText("Library")).not.toBeInTheDocument();
    });

    it("closes the profile navigation and creates cookie", () => {
        const { getByRole } = render(
            <LeftNav
                permissions={{ "cohort.read": false }}
                initialLeftNavOpen={true}
                initialExpandLeftNavOnMobile={true}
                navHeading="Team"
            />
        );

        const toggle = getByRole("button", {
            name: "Collapse navigation",
        });
        fireEvent.click(toggle);

        expect(Cookies.set).toHaveBeenCalledWith(
            config.LEFT_NAV_COOKIE,
            "false"
        );
    });

    it("opens the profile navigation and creates cookie", () => {
        const { getByRole } = render(
            <LeftNav
                permissions={{ "cohort.read": false }}
                initialLeftNavOpen={false}
                initialExpandLeftNavOnMobile={true}
                navHeading="Team"
            />
        );

        const toggle = getByRole("button", {
            name: "Expand navigation",
        });
        fireEvent.click(toggle);

        expect(Cookies.set).toHaveBeenCalledWith(
            config.LEFT_NAV_COOKIE,
            "true"
        );
    });
});
