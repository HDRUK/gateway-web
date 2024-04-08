import React from "react";
import ShowMore from "@/components/ShowMore";
import { render } from "@/utils/testUtils";

describe("ShowMore", () => {
    it("should render component", async () => {
        const wrapper = render(
            <ShowMore maxHeight={24}>
                Vestibulum ultrices purus sit amet cursus gravida. Proin maximus
                porttitor dui, sed lobortis libero ultrices vitae. In a sem at
                erat venenatis rhoncus. Morbi at diam sed risus commodo tempus
                nec ac ligula. Curabitur arcu velit, volutpat in risus sed,
                suscipit commodo nulla. Aenean luctus feugiat eros at laoreet.
                Fusce rhoncus augue nec tellus ultrices, et tempor sapien
                sollicitudin.Vestibulum ultrices purus sit amet cursus gravida.
                Proin maximus porttitor dui, sed lobortis libero ultrices vitae.
                In a sem at erat venenatis rhoncus. Morbi at diam sed risus
                commodo tempus nec ac ligula. Curabitur arcu velit, volutpat in
                risus sed, suscipit commodo nulla. Aenean luctus feugiat eros at
                laoreet. Fusce rhoncus augue nec tellus ultrices, et tempor
                sapien sollicitudin.Vestibulum ultrices purus sit amet cursus
                gravida. Proin maximus porttitor dui, sed lobortis libero
                ultrices vitae. In a sem at erat venenatis rhoncus. Morbi at
                diam sed risus commodo tempus nec ac ligula. Curabitur arcu
                velit, volutpat in risus sed, suscipit commodo nulla. Aenean
                luctus feugiat eros at laoreet. Fusce rhoncus augue nec tellus
                ultrices, et tempor sapien sollicitudin.Vestibulum ultrices
                purus sit amet cursus gravida. Proin maximus porttitor dui, sed
                lobortis libero ultrices vitae. In a sem at erat venenatis
                rhoncus. Morbi at diam sed risus commodo tempus nec ac ligula.
                Curabitur arcu velit, volutpat in risus sed, suscipit commodo
                nulla. Aenean luctus feugiat eros at laoreet. Fusce rhoncus
                augue nec tellus ultrices, et tempor sapien
                sollicitudin.Vestibulum ultrices purus sit amet cursus gravida.
                Proin maximus porttitor dui, sed lobortis libero ultrices vitae.
                In a sem at erat venenatis rhoncus. Morbi at diam sed risus
                commodo tempus nec ac ligula. Curabitur arcu velit, volutpat in
                risus sed, suscipit commodo nulla. Aenean luctus feugiat eros at
                laoreet. Fusce rhoncus augue nec tellus ultrices, et tempor
                sapien sollicitudin.Vestibulum ultrices purus sit amet cursus
                gravida. Proin maximus porttitor dui, sed lobortis libero
                ultrices vitae. In a sem at erat venenatis rhoncus. Morbi at
                diam sed risus commodo tempus nec ac ligula. Curabitur arcu
                velit, volutpat in risus sed, suscipit commodo nulla. Aenean
                luctus feugiat eros at laoreet. Fusce rhoncus augue nec tellus
                ultrices, et tempor sapien sollicitudin.
            </ShowMore>
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
