const fs = require("fs");
const path = require("path");

function updateChartYamlVersion(newVersion) {
  try {


  const chartFilePath = path.resolve(__dirname, "chart/Chart.yaml");
  const chartContent = fs.readFileSync(chartFilePath, "utf8");

  const updatedContent = chartContent.replace(
    /^version:\s*[0-9]+\.[0-9]+\.[0-9]+/m,
    `version: ${newVersion}`
  );


  fs.writeFileSync(chartFilePath, updatedContent, "utf8");
  console.log(`Updated chart/Chart.yaml to version ${newVersion}`);
} catch(e){
  console.log(e)
  process.exit(1)
}
}

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
        // writerOpts: {
        //   transform: (commit, _context) => {
        //     const jiraBaseUrl = process.env.JIRA_URL;
        //     const jiraRegex = /\b([A-Z]+-\d+)\b/;
        //     const match = commit.subject.match(jiraRegex);

        //     if (match) {
        //       const ticket = match[1];
        //       commit.subject = commit.subject.replace(
        //         jiraRegex,
        //         `[${ticket}](${jiraBaseUrl}${ticket})`
        //       );
        //     }

        //     return commit;
        //   },
        // },
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
      "@semantic-release/git",
      {
        assets: [
          "package.json",
          "package-lock.json",
          "CHANGELOG.md",
          "chart/Chart.yaml",
        ],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: "node updateChartVersion.js ${nextRelease.version}",
      },
    ],
  ],
  updateChartYamlVersion,
};
