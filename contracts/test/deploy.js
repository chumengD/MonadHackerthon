const { ethers } = require("hardhat");

async function main() {
  const Token = await ethers.getContractFactory("dUnionToken");
  const token = await Token.deploy();
  await token.waitForDeployment();

  console.log(`✅ 已部署至: ${await token.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });