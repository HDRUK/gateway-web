const fs = require("fs");
const path = require("path");

const newVersion = process.argv[2];
if (!newVersion) {
    console.error("No version provided.");
    process.exit(1);
  }
function updateChartYamlVersion(newVersion) {
    const chartFilePath = path.resolve(__dirname, "chart/gateway-web/Chart.yaml");
    const chartContent = fs.readFileSync(chartFilePath, "utf8");
  
    const updatedContent = chartContent.replace(
      /^version:\s*[0-9]+\.[0-9]+\.[0-9]+/m,
      `version: ${newVersion}`
    );
  
  
    fs.writeFileSync(chartFilePath, updatedContent, "utf8");
    console.log(`Updated chart/Chart.yaml to version ${newVersion}`);
  }
  



updateChartYamlVersion(newVersion);