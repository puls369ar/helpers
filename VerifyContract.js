const { run } = require("hardhat");

async function verifyContract(address, contractPath, constructorArgs = []) {
    try {
        await run("verify:verify", {
            address,
            contract: contractPath,
            constructorArguments: constructorArgs, // Pass constructor arguments here
        });
        console.log(`Contract at ${address} verified on Etherscan!`);
        console.log("");
    } catch (err) {
        if (err.message.includes("Already Verified")) {
            console.log(`Contract at ${address} is already verified.`);
        } else {
            console.error(`Verification failed for contract at ${address}:`, err);
        }
        console.log("");
    }
}

module.exports = { verifyContract };
