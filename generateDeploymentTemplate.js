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
    const fileName = `deploy${contractName}.js`;
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
    const fileName = `verify${contractName}.js`;
    const outputPath = path.join(__dirname, fileName);

    // Write the script to a file
    fs.writeFileSync(outputPath, scriptContent.trim(), "utf-8");
    console.log(`Verification script generated: ${outputPath}`);
}

// Example usage
generateDeploymentScript("NFTMarketplace", ["name", "symbol"]);
generateVerificationScript("NFTMarketplace", "0x000", "/contracts/NFTMarketplace.sol:NFTMarketplace", ["name", "symbol"]);

// module.exports = { generateDeploymentScript };
// module.exports = { generateVerificationScript };
