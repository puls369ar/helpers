const fs = require("fs");
const path = require("path");

(async () => {
    
    console.log("Deploying Contracts");
    console.log();

    const deploymentUnitsPath = path.join(__dirname, "deploymentUnits");

    // Check if deploymentUnits folder exists
    if (!fs.existsSync(deploymentUnitsPath)) {
        console.error(`No deploymentUnits folder found at: ${deploymentUnitsPath}`);
        return;
    }

    // Read all generated deployment scripts
    const deploymentScripts = fs.readdirSync(deploymentUnitsPath).filter(file => file.endsWith(".js"));
    console.log(deploymentScripts); 
    for (const script of deploymentScripts) {
        try {
            console.log(`Deploying contract using: ${script}`);
            const scriptPath = path.join(deploymentUnitsPath, script);
            const deploymentFunction = require(scriptPath); // Require the deployment script

            deploymentFunction("Winery", "WNY"); 
            // Call the deployment function
            // await deploymentFunction[functionName]();
        } catch (err) {
            console.error(`Error deploying with script ${script}:`, err);
        }
        console.log();
    }

    console.log("All contracts deployed!");
})();