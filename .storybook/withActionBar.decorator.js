import ActionBarProvider from "../src/providers/ActionBar";

export const withActionBar = Story => {
    return (
        <ActionBarProvider>
            <Story />
        </ActionBarProvider>
    );
};
