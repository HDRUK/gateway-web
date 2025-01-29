const { updateChartYamlVersion } = require("./release.config");
const newVersion = process.argv[2];

if (!newVersion) {
  console.error("No version provided.");
  process.exit(1);
}

updateChartYamlVersion(newVersion);