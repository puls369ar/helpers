const fs = require("fs");

function getConstructorArguments(abiPath) {
    try {
        // Read and parse the ABI JSON file
        const abiData = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

        // Directly access the constructor in the ABI
        const constructor = abiData.abi.find(entry => entry.type === "constructor");

        if (!constructor) {
            console.log("No constructor found in the ABI.");
            return;
        }

        // Output constructor arguments as JSON
        console.log("Constructor Arguments JSON:");
        console.log(JSON.stringify(constructor.inputs, null, 2));
    } catch (error) {
        console.error("Error reading or parsing ABI file:", error.message);
    }
}

// Specify the ABI file path
const abiPath = "artifacts/contracts/NFTFactory.sol/NFTFactory.json"; // Replace with your actual ABI file path
getConstructorArguments(abiPath);
