import { render, screen } from "@/utils/testUtils";
import ProviderLinks from "./ProviderLinks";

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

    it("should render preferred and not preferred access sections", async () => {
        render(
            <ProviderLinks showInstitution={() => console.log("show inst")} />
        );

        expect(
            screen.getByRole("heading", {
                name: /Preferred Access \(including Cohort Discovery/,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "Not Preferred Access" })
        ).toBeInTheDocument();
    });
});
