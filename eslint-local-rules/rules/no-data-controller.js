module.exports = {
  meta: {
    type: "suggestion", // or "problem" based on your rule's purpose
    fixable: "code", // This marks the rule as fixable
    docs: {
        description: 'Suggest replacing "Data Controller" with "Data Custodian"',
        category: "Best Practices",
        recommended: false,
    },
},
    create(context) {
        return {
            Literal(node) {
                if (
                    typeof node.value === "string" &&
                    node.value.includes("Data Controller")
                ) {
                    context.report({
                        node,
                        message:
                            'Replace "Data Controller" with "Data Custodian"',
                        fix: fixer => {
                            const newValue = node.raw.replace(
                                /Data Controller/g,
                                "Data Custodian"
                            );
                            return fixer.replaceText(node, newValue);
                        },
                    });
                }
            },
        };
    },
};
