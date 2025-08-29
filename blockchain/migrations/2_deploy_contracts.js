const CredentialVerifier = artifacts.require("CredentialVerifier");
const ResumeRegistry = artifacts.require("ResumeRegistry");

module.exports = function (deployer, network, accounts) {
  // Deploy CredentialVerifier contract
  deployer.deploy(CredentialVerifier)
    .then(() => {
      console.log("✅ CredentialVerifier deployed at:", CredentialVerifier.address);
      
      // Deploy ResumeRegistry contract
      return deployer.deploy(ResumeRegistry);
    })
    .then(() => {
      console.log("✅ ResumeRegistry deployed at:", ResumeRegistry.address);
      
      // Log contract addresses for frontend integration
      console.log("\n📋 Contract Deployment Summary:");
      console.log("================================");
      console.log("Network:", network);
      console.log("Deployer Account:", accounts[0]);
      console.log("CredentialVerifier:", CredentialVerifier.address);
      console.log("ResumeRegistry:", ResumeRegistry.address);
      console.log("\n🔧 Add these addresses to your frontend configuration!");
      
      return Promise.resolve();
    })
    .catch(error => {
      console.error("❌ Deployment failed:", error);
      throw error;
    });
};