import type { Meta, StoryObj } from "@storybook/nextjs";
import Box from "@/components/Box";
import StepList from "./StepList";

const meta = {
    component: StepList,
    tags: ["autodocs"],
    decorators: [
        Story => (
            <Box sx={{ maxWidth: 900, bgcolor: "white" }}>
                <Story />
            </Box>
        ),
    ],
} satisfies Meta<typeof StepList>;

export default meta;

type Story = StoryObj<typeof StepList>;

// The "About Cohort Discovery" tab: four numbered steps, a button on step 2.
export const About: Story = {
    args: {
        steps: [
            {
                stepTitle: "Define your cohort",
                stepText:
                    "<p>Use the intuitive query builder to describe the population you're interested in and define specific cohort criteria (e.g. females aged under 35 with asthma).</p>",
            },
            {
                stepTitle: "Search across UK datasets",
                stepText:
                    "<p>Run your query securely in real time across multiple pseudonymised datasets held across the UK.</p>",
                buttonKey: "viewDatasets",
            },
            {
                stepTitle: "Review matching results",
                stepText:
                    "<p>Receive real-time counts of individuals matching your criteria and identify datasets relevant to your research.</p>",
            },
            {
                stepTitle:
                    "Connect with custodians & request access to data",
                stepText:
                    "<p>Contact the relevant Data Custodian to learn more & submit Data Access Requests through the Gateway. Apply to multiple custodians using a standardised process.</p>",
            },
        ],
    },
};

// A flow that mixes numbered steps with non-numbered "email notification"
// markers — numbering only advances on numbered rows.
export const WithEmailMarkers: Story = {
    args: {
        steps: [
            {
                stepTitle: "Gateway Account with relevant Credentials",
                stepText:
                    '<p>To access the Cohort Discovery Service, you must demonstrate your Safe People status. This involves:</p><ul class="checklist"><li>Being a recognised researcher, NHS analyst or equivalent</li><li>Having a complete Gateway user profile</li><li class="cross">Do not use Gmail</li></ul><p class="warning">Please note this is not the final step in gaining access.</p>',
            },
            {
                stepTitle: "Apply for Cohort Discovery Access",
                stepText:
                    "<p>Start application, read terms and conditions and submit application.</p>",
                buttonKey: "viewDatasets",
            },
            {
                stepTitle:
                    "Email notification confirming your application request",
                stepText: "",
                marker: "email",
            },
            {
                stepTitle: "Application Review",
                stepText:
                    "<p>This step generally takes 3 working days. Your application will be reviewed based on your Gateway profile and submitted information.</p>",
            },
            {
                stepTitle: "Access Decision",
                stepText:
                    "<p>In some cases, access may not be granted if eligibility criteria are not met.</p>",
            },
        ],
    },
};
