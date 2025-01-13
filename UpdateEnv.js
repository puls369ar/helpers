const fs = require("fs");

async function updateEnvFile(key, value) {
    const envFilePath = ".env";
    const envVariables = fs.existsSync(envFilePath)
        ? fs.readFileSync(envFilePath, "utf8").split("\n")
        : [];

    const updatedVariables = envVariables.filter(
        (line) => !line.startsWith(`${key}=`)
    );

    updatedVariables.push(`${key}=${value}`);
    fs.writeFileSync(envFilePath, updatedVariables.join("\n"), "utf8");
    console.log(`Updated .env: ${key}=${value}`);
}

module.exports = { updateEnvFile };
