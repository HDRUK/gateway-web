import { render, screen } from "@/utils/testUtils";
import LabelAndDescription from "./LabelAndDescription";

describe("LabelAndDescription", () => {
    it("should render label and description", () => {
        render(
            <LabelAndDescription
                label="This is a label"
                description="This is a description"
            />
        );

        expect(screen.getByText("This is a label")).toBeInTheDocument();
        expect(screen.getByText("This is a description")).toBeInTheDocument();
    });
});
