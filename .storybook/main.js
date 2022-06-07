const path = require('path');

module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-controls',
        '@storybook/preset-create-react-app',
        {
            name: '@storybook/addon-storysource',
            options: {
                loaderOptions: {
                    prettierConfig: { printWidth: 80, singleQuote: true },
                },
            },
        },
    ],
};
