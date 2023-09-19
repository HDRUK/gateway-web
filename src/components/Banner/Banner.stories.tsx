import type { Meta } from "@storybook/react";
import Banner from "@/components/Banner";
import { BannerProps } from "./Banner";
import Image from "../../../public/images/banners/release-notes.png";

const meta: Meta<typeof Banner> = {
    component: Banner,
};

export default meta;

export const Default = (args: BannerProps) => <Banner {...args} />;

Default.args = {
    title: "Gateway Releases",
    subTitle:
        "The Gateway requires a significant volume of design and development work to deliver our vision and ambition. To achieve this our teams are continually working on the Gateway and deliver major software releases approximately every 4 weeks.",
    src: Image,
};
