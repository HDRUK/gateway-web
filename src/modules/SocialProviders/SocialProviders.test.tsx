import { useForm } from "react-hook-form";
import SocialProviders from "@/modules/SocialProviders";
import { render } from "@/utils/testUtils";

describe("SocialProviders", () => {
    const Component = () => {
        const { getValues } = useForm<{ provider: string }>({
            defaultValues: {
                provider: "google",
            },
        });
        return (
            <SocialProviders
                label="Your preferred sign in method"
                name="provider"
                getValues={getValues}
            />
        );
    };
    it("should render content", () => {
        const wrapper = render(<Component />);
        expect(wrapper.container).toMatchSnapshot();
    });
});
