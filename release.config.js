module.exports = 
{
  "branches": [
    "chore/GAT-6176"
  ],
  "plugins": [
    [
      "@semantic-release/commit-analyzer"
    ],
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    "@semantic-release/github",
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        "assets": [
          "package.json",
          "package-lock.json",
          "CHANGELOG.md"
        ],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ],
  dryRun: true,// this will not trigger a release, but will create a changelog
}
  