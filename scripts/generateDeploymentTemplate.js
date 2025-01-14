const fs = require("fs");
const path = require("path");

/**
 * Generates a deployment script template for the given contract name and parameters.
 * @param {string} contractName - The name of the contract.
 * @param {Array<string>} contractParams - The parameters for the constructor.
 */
async function generateDeploymentScript(contractName, contractParams) {
    // Convert the contract name to lowercase for variable naming
    const contractNameLowerCase = contractName.charAt(0).toLowerCase() + contractName.slice(1);

    // Construct the parameters list for the function and deployment call
    const functionParams = contractParams.join(", ");
    const deployParams =  contractParams.length > 0 ? contractParams.map(param => `${param}`).join(", ") + "," : "";

    // Template for the deployment script
    const scriptContent = `
async function deploy${contractName}(${functionParams}) {
    const ${contractName} = await ethers.getContractFactory("${contractName}");
    const ${contractNameLowerCase} = await ${contractName}.deploy(${deployParams} { gasPrice: 130 * 10**9, gasLimit: 10**7 });
    await ${contractNameLowerCase}.waitForDeployment();
    const ${contractNameLowerCase}_address = await ${contractNameLowerCase}.getAddress();
    console.log(\"\`${contractName}\` deployed to:\", ${contractNameLowerCase}_address);
    console.log(\"\");
}

module.exports = { deploy${contractName} };
        `;

    // Define the output file path
    const fileName = `deploymentUnits/deploy${contractName}.js`;
    const outputPath = path.join(__dirname, fileName);

    // Write the script to a file
    fs.writeFileSync(outputPath, scriptContent.trim(), "utf-8");
    console.log(`Deployment script generated: ${outputPath}`);
}

async function generateVerificationScript(contractName, contractAddress, contractPath, contractParams) {
    // Convert the contract name to lowercase for variable naming
    const contractNameLowerCase = contractName.charAt(0).toLowerCase() + contractName.slice(1);

    // Construct the parameters list for the function and deployment call
    const functionParams = contractParams.join(", ");
    const deployParams =  contractParams.length > 0 ? contractParams.map(param => `${param}`).join(", ") + "," : "";

    // Template for the deployment script
    const scriptContent = `
// Verification function
async function verifyContract(address, contractPath, args) {
    try {
        await run("verify:verify", {
            address: "${contractAddress}",
            contract: "${contractPath}",
            constructorArguments: args // Pass constructor arguments here
        });
        console.log(\`Contract at ${contractAddress} verified on Etherscan!\`);
        console.log(\"\");
        console.log("");
    } catch (err) {
        if (err.message.includes("Already Verified")) {
            console.log(\`Contract at ${contractAddress} is already verified.\`);
            console.log(\"\");
            console.log(\"\");
        } else {
            console.error(\`Verification failed for contract at ${contractAddress}:\`, err);
            console.log(\"\");
            console.log(\"\");
        }
    }
}
        `;

    // Define the output file path
    const fileName = `verificationUnits/verify${contractName}.js`;
    const outputPath = path.join(__dirname, fileName);

    // Write the script to a file
    fs.writeFileSync(outputPath, scriptContent.trim(), "utf-8");
    console.log(`Verification script generated: ${outputPath}`);
}

    // async function generateUnits() {
    //     generateDeploymentScript("NFTMarketplace", ["name", "symbol"]);
    // }

// generateVerificationScript("NFTMarketplace", "0x000", "/contracts/NFTMarketplace.sol:NFTMarketplace", ["name", "symbol"]);

async function loopOverArtifacts() {
    const artifactsPath = path.join(__dirname, "..", "artifacts", "contracts");
    fs.mkdirSync("scripts/deploymentUnits");
    fs.mkdirSync("scripts/verificationUnits");

    // Check if the artifactsPath exists
    if (!fs.existsSync(artifactsPath)) {
        console.error(`Directory not found: ${artifactsPath}`);
        return;
    }

    // Iterate over all contract JSON files in the artifacts folder
    fs.readdirSync(artifactsPath).forEach((contractFolder) => {
        const contractPath = path.join(artifactsPath, contractFolder);

        if (fs.lstatSync(contractPath).isDirectory()) {
            const files = fs.readdirSync(contractPath);

            files.forEach((file) => {
                // Only process the *.json files (skip .dbg.json)
                if (file.endsWith(".json") && !file.endsWith(".dbg.json")) {
                    const jsonPath = path.join(contractPath, file);
                    const contractData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

                    // Check if the ABI exists and has a constructor
                    if (contractData.abi && Array.isArray(contractData.abi)) {
                        const constructorInputNames = contractData.abi
                            .filter((item) => item.type === "constructor")
                            .map((item) => item.inputs.map((input) => input.name))
                            .flat(); // Flatten the array of input names

                        const contractName = contractData.contractName || path.basename(file, ".json");

                        if (constructorInputNames.length > 0) {
                            generateDeploymentScript(contractName, [constructorInputNames]);
                            console.log(`Contract: ${contractName}, Constructor Args: ${constructorInputNames}`);
                        } else {
                            generateDeploymentScript(contractName, []);

                            console.log(`Contract: ${contractName} has no constructor parameters.`);
                        }
                    } else {
                        console.error(`ABI is missing or not in expected format for contract: ${file}`);
                        console.log();
                    }
                }
            });
        }
    });
    console.log();

}


function generateDeployContractsScript() {
    const deployContractsPath = path.join(__dirname, "deployContracts.js");
    const scriptContent = `
const fs = require("fs");
const path = require("path");
const { loopOverArtifacts } = require('./path/to/loopOverArtifacts');

(async () => {
    console.log("Generating deployment scripts for all contracts in the artifacts folder...");
    console.log();
    await loopOverArtifacts(); // Generates deployment scripts
    console.log("Deploying Contracts");
    console.log();

    const deploymentUnitsPath = path.join(__dirname, "scripts", "deploymentUnits");

    // Check if deploymentUnits folder exists
    if (!fs.existsSync(deploymentUnitsPath)) {
        console.error(\`No deploymentUnits folder found at: \${deploymentUnitsPath}\`);
        return;
    }

    // Read all generated deployment scripts
    const deploymentScripts = fs.readdirSync(deploymentUnitsPath).filter(file => file.endsWith(".js"));

    for (const script of deploymentScripts) {
        try {
            console.log(\`Deploying contract using: \${script}\`);
            const scriptPath = path.join(deploymentUnitsPath, script);
            const deploymentFunction = require(scriptPath); // Require the deployment script
            const functionName = Object.keys(deploymentFunction)[0]; // Extract the function name

            // Call the deployment function
            await deploymentFunction[functionName]();
        } catch (err) {
            console.error(\`Error deploying with script \${script}:\`, err);
        }
        console.log();
    }

    console.log("All contracts deployed!");
})();
    `;

    // Write the script to the target location
    fs.writeFileSync(deployContractsPath, scriptContent.trim(), "utf-8");
    console.log(`Generated Deploy Contracts script at: ${deployContractsPath}`);

    return deployContractsPath;
}

// Generate and run the Deploy Contracts script
const deployScriptPath = generateDeployContractsScript();
console.log(`Running generated Deploy Contracts script: ${deployScriptPath}`);
import(deployScriptPath).catch((err) => console.error("Error running the Deploy Contracts script:", err));

