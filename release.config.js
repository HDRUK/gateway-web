module.exports = {
  branches: ["chore/GAT-6176"],
  plugins: [
    "@semantic-release/commit-analyzer",
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "✨ Features" },
            { type: "fix", section: "🐛 Bug Fixes" },
            { type: "perf", section: "⚡ Performance Improvements" },
            { type: "docs", section: "📖 Documentation", hidden: false },
            { type: "chore", section: "🔧 Maintenance", hidden: false },
          ],
        },
        writerOpts: {
          transform: (commit, _context) => {
            if (!commit || typeof commit !== "object") return commit;

            const jiraBaseUrl = process.env.JIRA_URL
            const jiraRegex = /\b([A-Z]+-\d+)\b/g;

              const newCommit = { ...commit };

            // Ensure the commit has a valid date
            if (typeof newCommit.date === "string") {
              newCommit.date = new Date(newCommit.date);
            }

            if (newCommit.subject && typeof newCommit.subject === "string") {
              newCommit.subject = newCommit.subject.replace(
                jiraRegex,
                `[$1](${jiraBaseUrl}$1)`
              );
            }

            return newCommit;
          },
        },
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    "@semantic-release/github",
    [
      "@semantic-release/exec",
      {
        prepareCmd: "node updateVersions.js ${nextRelease.version} && git add chart/gateway-web/Chart.yaml package.json",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: [
          "package.json",
          "package-lock.json",
          "CHANGELOG.md",
          "chart/gateway-web/Chart.yaml",
        ],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
