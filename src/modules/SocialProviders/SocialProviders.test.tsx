import { useForm } from "react-hook-form";
import SocialProviders from "@/modules/SocialProviders";
import { render } from "@/utils/testUtils";

describe("SocialProviders", () => {
    const Component = () => {
        const { control, getValues } = useForm({
            defaultValues: {
                provider: "google",
            },
        });
        return (
            <SocialProviders
                label="Your preferred sign in method"
                name="provider"
                getValues={getValues}
                control={control}
            />
        );
    };
    it("should render content", () => {
        const wrapper = render(<Component />);
        expect(wrapper.container).toMatchSnapshot();
    });
});
