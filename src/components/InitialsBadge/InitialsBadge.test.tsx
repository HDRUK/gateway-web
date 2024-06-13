import InitialsBadge from "@/components/InitialsBadge";
import { render, screen } from "@/utils/testUtils";

describe("InitialsBadge", () => {
    it("should render intitials", () => {
        render(<InitialsBadge initials="AB" />);
        expect(screen.getByText("AB")).toBeInTheDocument();
    });
    it("should render intitials", () => {
        render(<InitialsBadge fullName="abby bookman" />);
        expect(screen.getByText("AB")).toBeInTheDocument();
    });
});
