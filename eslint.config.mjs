// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import next from 'eslint-config-next';
export default [...next, ...storybook.configs["flat/recommended"]];
