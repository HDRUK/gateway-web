import type { Meta, StoryObj } from "@storybook/react";
import LogoSlider from "./LogoSlider";

const meta: Meta<typeof LogoSlider> = {
    component: LogoSlider,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof LogoSlider>;

export const Default: Story = {
    args: {
        images: [
            {
                alt: "Microsoft",
                imageSrc: "/images/logos/microsoft-logo.png",
                websiteUrl: "http://www.google.com",
            },
            {
                alt: "LinkedIn",
                imageSrc: "/images/logos/linkedIn-logo.png",
                websiteUrl: "http://www.google.com",
            },
            {
                alt: "Google",
                imageSrc: "/images/logos/google-logo.png",
                websiteUrl: "http://www.google.com",
            },
        ],
    },
};
