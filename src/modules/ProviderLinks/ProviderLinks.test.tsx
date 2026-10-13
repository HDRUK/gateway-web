import { FeatureProvider, FeatureType } from "@/providers/FeatureProvider";
import { render, screen } from "@/utils/testUtils";
import ProviderLinks from "./ProviderLinks";

const renderWithFeatures = (features: FeatureType) =>
    render(
        <FeatureProvider feature={features}>
            <ProviderLinks showInstitution={() => console.log("show inst")} />
        </FeatureProvider>
    );

describe("ProviderLinks", () => {
    it("should match snapshot", async () => {
        const wrapper = render(
            <ProviderLinks showInstitution={() => console.log("show inst")} />
        );

        expect(wrapper.container).toMatchSnapshot();
    });

    it("should render component", async () => {
        render(
            <ProviderLinks showInstitution={() => console.log("show inst")} />
        );

        expect(screen.getByAltText("Azure")).toBeInTheDocument();
        expect(screen.getByAltText("LinkedIn")).toBeInTheDocument();
        expect(screen.getByAltText("Google")).toBeInTheDocument();
        expect(screen.getByTitle("your institute")).toBeInTheDocument();
    });

    it("should render preferred and non preferred access sections", async () => {
        render(
            <ProviderLinks showInstitution={() => console.log("show inst")} />
        );

        expect(
            screen.getByRole("heading", {
                name: /Preferred Access \(including option to apply for Cohort Discovery/,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "Non-preferred Access" })
        ).toBeInTheDocument();
    });

    it("should hide only the provider whose feature flag is off", async () => {
        renderWithFeatures({ isLoginGoogleEnabled: false });

        expect(screen.queryByAltText("Google")).not.toBeInTheDocument();
        expect(screen.getByAltText("Azure")).toBeInTheDocument();
        expect(screen.getByAltText("LinkedIn")).toBeInTheDocument();
        expect(screen.getByTitle("your institute")).toBeInTheDocument();
    });

    it("should drop a section heading once every provider in it is off", async () => {
        renderWithFeatures({
            isLoginGoogleEnabled: false,
            isLoginLinkedInEnabled: false,
        });

        expect(
            screen.queryByRole("heading", { name: "Non-preferred Access" })
        ).not.toBeInTheDocument();
        expect(
            screen.getByRole("heading", {
                name: /Preferred Access \(including option to apply for Cohort Discovery/,
            })
        ).toBeInTheDocument();
    });

    it("should render nothing at all once every provider is off", async () => {
        const { container } = renderWithFeatures({
            isLoginGoogleEnabled: false,
            isLoginLinkedInEnabled: false,
            isLoginAzureEnabled: false,
            isLoginOpenAthensEnabled: false,
        });

        expect(
            screen.queryByRole("heading", { name: /Access/ })
        ).not.toBeInTheDocument();
        expect(container.textContent).toBe("");
    });

    it("should hide every provider while login is globally disabled", async () => {
        renderWithFeatures({
            isLoginDisabled: true,
            isSafePeopleRegistrySSOEnabled: true,
        });

        expect(screen.queryByAltText("Google")).not.toBeInTheDocument();
        expect(screen.queryByAltText("Azure")).not.toBeInTheDocument();
        expect(screen.queryByAltText("LinkedIn")).not.toBeInTheDocument();
        expect(screen.queryByTitle("your institute")).not.toBeInTheDocument();
        expect(
            screen.queryByAltText("Safe People Registry")
        ).not.toBeInTheDocument();
    });

    /**
     * Registry is gated by two flags that mean different things: whether the
     * integration is released at all, and whether it is currently working.
     */
    it("should show Registry when its release and login flags both allow it", async () => {
        renderWithFeatures({
            isSafePeopleRegistrySSOEnabled: true,
            isLoginRegistryEnabled: true,
        });

        expect(screen.getByAltText("Safe People Registry")).toBeInTheDocument();
    });

    it("should hide Registry when its login flag is off despite being released", async () => {
        renderWithFeatures({
            isSafePeopleRegistrySSOEnabled: true,
            isLoginRegistryEnabled: false,
        });

        expect(
            screen.queryByAltText("Safe People Registry")
        ).not.toBeInTheDocument();
        expect(screen.getByAltText("Azure")).toBeInTheDocument();
    });

    it("should hide Registry when it is not released, however its login flag stands", async () => {
        renderWithFeatures({ isLoginRegistryEnabled: true });

        expect(
            screen.queryByAltText("Safe People Registry")
        ).not.toBeInTheDocument();
    });
});
