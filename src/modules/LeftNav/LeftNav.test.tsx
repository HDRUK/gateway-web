import mediaQuery from "css-mediaquery";
import Cookies from "js-cookie";
import mockRouter from "next-router-mock";
import config from "@/config/config";
import { RouteName } from "@/consts/routeName";
import { fireEvent, render, waitFor, within } from "@/utils/testUtils";
import LeftNav from "./LeftNav";

jest.mock("js-cookie", () => ({
    set: jest.fn(),
}));

type MatchMedia = (query: string) => MediaQueryList;

function createMatchMedia(width: number): MatchMedia {
    return (query: string): MediaQueryList => ({
        matches: mediaQuery.match(query, { width }),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    });
}

function setScreenWidth(width: number) {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: createMatchMedia(width),
    });
}

describe("LeftNav", () => {
    beforeEach(() => {
        // Default desktop width
        setScreenWidth(1200);
    });
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

    it("mobile horizontal nav can be opened by default", () => {
        const { getByText } = render(
            <LeftNav
                permissions={{ "cohort.read": false }}
                initialLeftNavOpen={true}
            />
        );

        expect(getByText("Your Profile")).toBeInTheDocument();
        expect(getByText("Library")).toBeInTheDocument();
    });

    it("mobile horizontal nav can be collapsed with button click", async () => {
        setScreenWidth(200);
        const { getByRole, queryByText } = render(
            <LeftNav
                permissions={{ "cohort.read": false }}
                initialLeftNavOpen={true}
                navHeading="Team"
            />
        );
        expect(queryByText("Library")).toBeInTheDocument();

        const toggle = getByRole("button", {
            name: "Your Profile",
        });
        fireEvent.click(toggle);

        await waitFor(() => {
            expect(queryByText("Library")).not.toBeInTheDocument();
        });
        expect(Cookies.set).toHaveBeenCalledWith(
            config.EXPAND_LEFT_NAV_ON_MOBILE,
            "false"
        );
    });

    it("closes the profile navigation and creates cookie", () => {
        const { getByRole } = render(
            <LeftNav
                permissions={{ "cohort.read": false }}
                initialLeftNavOpen={true}
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
