module.exports = {
    "*.(ts|tsx)": ["prettier --write", "eslint --fix"],
    "*.{json,md}": ["prettier --write"],
};
