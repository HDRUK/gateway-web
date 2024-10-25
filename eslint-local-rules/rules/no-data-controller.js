module.exports = {
    meta: {
        type: "problem",
        fixable: "code",
        docs: {
            description:
                'Suggest replacing "Data Controller", "Data Processor", or "Data Provider" with "Data Custodian"',
            category: "Gateway Formatting",
            recommended: true,
        },
    },
    create(context) {
        const patterns = ["Data Controller", "Data Processor", "Data Provider"];

        return {
            Literal(node) {
                if (typeof node.value === "string") {
                    let newValue = node.value;
                    let hasMatch = false;

                    // Check for the patterns, considering case insensitivity
                    patterns.forEach(pattern => {
                        const regex = new RegExp(pattern, "gi"); // 'g' for global, 'i' for case-insensitive
                        if (regex.test(newValue)) {
                            newValue = newValue.replace(
                                regex,
                                "Data Custodian"
                            );
                            hasMatch = true;
                        }
                    });

                    if (hasMatch) {
                        context.report({
                            node,
                            message: `Replace "Data Controller", "Data Processor", or "Data Provider" with "Data Custodian"`,
                            fix: fixer =>
                                fixer.replaceText(
                                    node,
                                    node.raw.replace(node.value, newValue)
                                ),
                        });
                    }
                }
            },
        };
    },
};
