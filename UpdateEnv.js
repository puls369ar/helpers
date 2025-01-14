const fs = require("fs");
const dotenv = require("dotenv");

async function updateEnvFile(key, value) {
    const envFilePath = ".env";

    // Read existing .env file content or initialize an empty array
    const envVariables = fs.existsSync(envFilePath)
        ? fs.readFileSync(envFilePath, "utf8").split("\n")
        : [];

    let keyExists = false;

    // Update existing variable or keep other lines intact
    const updatedVariables = envVariables.map((line) => {
        if (line.startsWith(`${key}=`)) {
            keyExists = true; // Mark the key as existing
            return `${key}=${value}`; // Update the value
        }
        return line; // Keep other lines unchanged
    });

    // Add the variable if it doesn't exist
    if (!keyExists) {
        updatedVariables.push(`${key}=${value}`);
    }

    // Write back to the .env file
    fs.writeFileSync(envFilePath, updatedVariables.join("\n"), "utf8");
    console.log(`Updated .env: ${key}=${value}`);

    // Reload the updated .env file
    dotenv.config({ override: true });
}

module.exports = { updateEnvFile };
