async function deploySimple() {
    const Simple = await ethers.getContractFactory("Simple");
    const simple = await Simple.deploy( { gasPrice: 130 * 10**9, gasLimit: 10**7 });
    await simple.waitForDeployment();
    const simple_address = await simple.getAddress();
    console.log("`Simple` deployed to:", simple_address);
    console.log("");
}

module.exports = { deploySimple };