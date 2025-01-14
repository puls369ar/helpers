const fs = require("fs");
const path = require("path");

(async () => {
    console.log("Generating deployment scripts for all contracts in the artifacts folder...");
    console.log();
    await loopOverArtifacts(); // Generates deployment scripts
    console.log("Deploying Contracts");
    console.log();

    const deploymentUnitsPath = path.join(__dirname, "scripts", "deploymentUnits");

    // Check if deploymentUnits folder exists
    if (!fs.existsSync(deploymentUnitsPath)) {
        console.error(`No deploymentUnits folder found at: ${deploymentUnitsPath}`);
        return;
    }

    // Read all generated deployment scripts
    const deploymentScripts = fs.readdirSync(deploymentUnitsPath).filter(file => file.endsWith(".js"));

    for (const script of deploymentScripts) {
        try {
            console.log(`Deploying contract using: ${script}`);
            const scriptPath = path.join(deploymentUnitsPath, script);
            const deploymentFunction = require(scriptPath); // Require the deployment script
            const functionName = Object.keys(deploymentFunction)[0]; // Extract the function name

            // Call the deployment function
            await deploymentFunction[functionName]();
        } catch (err) {
            console.error(`Error deploying with script ${script}:`, err);
        }
        console.log();
    }

    console.log("All contracts deployed!");
})();