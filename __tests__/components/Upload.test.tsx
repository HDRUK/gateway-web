import Upload from "@/components/Upload";
import { useForm } from "react-hook-form";
import { render, screen } from "../testUtils";

describe("Upload", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (props: any) => {
        const label = "Upload File";
        const { control } = useForm();
        return (
            <Upload
                label={label}
                name="uploadFile"
                control={control}
                {...props}
            />
        );
    };
    it("renders the component with the correct label", () => {
        render(<Component />);
        expect(screen.getByText("Upload File")).toBeInTheDocument();
    });
});
