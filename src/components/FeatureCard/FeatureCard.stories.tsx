import AccountTreeIcon from "@mui/icons-material/AccountTree";
import type { Meta, StoryObj } from "@storybook/nextjs";
import FeatureCard from "./FeatureCard";
import FeatureCardBody from "./FeatureCardBody";
import FeatureCardHeading from "./FeatureCardHeading";

const meta: Meta<typeof FeatureCard> = {
    component: FeatureCard,
    title: "Cards/FeatureCard",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FeatureCard>;

const WrapperComponent = props => {
    return (
        <FeatureCard {...props} href="/">
            <FeatureCardHeading>Cohort Discovery</FeatureCardHeading>
            <FeatureCardBody>Cohort Discovery</FeatureCardBody>
        </FeatureCard>
    );
};

export const Default: Story = {
    args: {
        icon: <AccountTreeIcon />,
    },
    render: props => <WrapperComponent {...props} />,
};
