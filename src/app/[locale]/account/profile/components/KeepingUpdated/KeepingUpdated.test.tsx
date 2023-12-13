import KeepingUpdated from "./KeepingUpdated";
import { useForm } from "react-hook-form";
import { render } from "@/utils/testUtils";

describe("KeepingUpdated", () => {
    const Component = () => {
        const { control } = useForm();
        return (
            <KeepingUpdated
                fields={[
                    {
                        title: "Feedback",
                        label: "I am happy to be contacted to share and give feedback on my experience with the Gateway",
                        name: "contact_feedback",
                        component: "CheckboxRow",
                    },
                ]}
                control={control}
            />
        );
    };
    it("should render content", () => {
        const wrapper = render(<Component />);
        expect(wrapper.container).toMatchSnapshot();
    });
});
