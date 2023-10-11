import { render, screen } from "@/utils/testUtils";
import CopyableTextBox from "./CopyableTextBox";

describe("CopyableTextBox", () => {
    it("should render component", async () => {
        render(<CopyableTextBox content={"content to copy"}/>);
        expect(screen.getByText("content to copy")).toBeInTheDocument();
        expect(screen.getByRole("button",{name: "copy text"})).toBeInTheDocument();
    });
});
