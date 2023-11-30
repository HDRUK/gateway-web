import ActionBarProvider from "../src/providers/ActionBarProvider";

export const withActionBar = Story => {
    return (
        <ActionBarProvider>
            <Story />
        </ActionBarProvider>
    );
};
