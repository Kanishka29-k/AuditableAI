import Web3 from 'web3';
import { create as ipfsHttpClient } from 'ipfs-http-client';

// Contract ABIs (you'll get these after compilation)
import CredentialVerifierABI from '../contracts/CredentialVerifier.json';
import ResumeRegistryABI from '../contracts/ResumeRegistry.json';

// Contract addresses (update after deployment)
const CONTRACTS = {
  CREDENTIAL_VERIFIER: '0xA050Ef051aF200f4336E366b269f1278B28a4F13',  // Update after deployment
  RESUME_REGISTRY: '0xEF2066ad1Bf778558E3Dfc908A61C294dB81E4b3',      // Update after deployment
};

// Network configuration
const NETWORKS = {
  GANACHE: {
    chainId: '0x539', // 1337 in decimal
    chainName: 'Ganache Local',
    rpcUrls: ['http://127.0.0.1:8545'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  POLYGON_MUMBAI: {
    chainId: '0x13881',
    chainName: 'Polygon Mumbai',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  }
};

class BlockchainService {
  constructor() {
    this.web3 = null;
    this.accounts = [];
    this.credentialContract = null;
    this.resumeContract = null;
    this.ipfs = null;
    this.currentNetwork = 'GANACHE';
    
    // Initialize IPFS client
    this.initIPFS();
  }

  // Initialize IPFS client
  initIPFS() {
    try {
      // Using local IPFS node or Infura IPFS
      this.ipfs = ipfsHttpClient({
        host: 'localhost',
        port: 5001,
        protocol: 'http'
      });
      
      // Fallback to Infura IPFS if local node is not available
      // this.ipfs = ipfsHttpClient({
      //   host: 'ipfs.infura.io',
      //   port: 5001,
      //   protocol: 'https',
      //   headers: {
      //     authorization: `Basic ${Buffer.from('your-project-id:your-secret').toString('base64')}`
      //   }
      // });
    } catch (error) {
      console.warn('IPFS initialization failed:', error);
    }
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  }

  // Connect to MetaMask wallet
  async connectWallet() {
    try {
      if (!this.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.');
      }

      // Initialize Web3
      this.web3 = new Web3(window.ethereum);
      this.accounts = accounts;

      // Initialize contracts
      await this.initializeContracts();

      // Set up event listeners
      this.setupEventListeners();

      return {
        success: true,
        account: accounts[0],
        network: await this.getCurrentNetwork()
      };

    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  // Initialize smart contracts
  async initializeContracts() {
    try {
      const networkId = await this.web3.eth.net.getId();
      
      // Initialize CredentialVerifier contract
      this.credentialContract = new this.web3.eth.Contract(
        CredentialVerifierABI.abi,
        CONTRACTS.CREDENTIAL_VERIFIER
      );

      // Initialize ResumeRegistry contract
      this.resumeContract = new this.web3.eth.Contract(
        ResumeRegistryABI.abi,
        CONTRACTS.RESUME_REGISTRY
      );

      console.log('Smart contracts initialized successfully');
    } catch (error) {
      console.error('Contract initialization failed:', error);
      throw error;
    }
  }

  // Get current network information
  async getCurrentNetwork() {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkId = parseInt(chainId, 16);
      
      return {
        chainId,
        networkId,
        name: this.getNetworkName(chainId)
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      return null;
    }
  }

  // Get network name from chain ID
  getNetworkName(chainId) {
    const networks = {
      '0x3': 'Ropsten Testnet',
      '0x4': 'Rinkeby Testnet',
      '0x5': 'Goerli Testnet',
      '0x539': 'Ganache Local',
      '0x13881': 'Polygon Mumbai'
    };
    return networks[chainId] || 'Unknown Network';
  }

  // Switch to correct network
  async switchNetwork(networkKey = 'GANACHE') {
    try {
      const network = NETWORKS[networkKey];
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });

      this.currentNetwork = networkKey;
      return true;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORKS[networkKey]],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add network:', addError);
          throw addError;
        }
      }
      throw switchError;
    }
  }

  // Upload file to IPFS
  async uploadToIPFS(file) {
    try {
      if (!this.ipfs) {
        throw new Error('IPFS client not initialized');
      }

      const result = await this.ipfs.add(file);
      return result.path; // Returns IPFS hash
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw error;
    }
  }

  // Upload JSON data to IPFS
  async uploadJSONToIPFS(data) {
    try {
      if (!this.ipfs) {
        throw new Error('IPFS client not initialized');
      }

      const jsonString = JSON.stringify(data);
      const result = await this.ipfs.add(jsonString);
      return result.path;
    } catch (error) {
      console.error('JSON upload to IPFS failed:', error);
      throw error;
    }
  }

  // Download from IPFS
  async downloadFromIPFS(hash) {
    try {
      if (!this.ipfs) {
        throw new Error('IPFS client not initialized');
      }

      const chunks = [];
      for await (const chunk of this.ipfs.cat(hash)) {
        chunks.push(chunk);
      }
      return new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
    } catch (error) {
      console.error('IPFS download failed:', error);
      throw error;
    }
  }

  // Issue a new credential
  async issueCredential(credentialData) {
    try {
      if (!this.credentialContract) {
        throw new Error('Credential contract not initialized');
      }

      // Upload credential data to IPFS
      const ipfsHash = await this.uploadJSONToIPFS(credentialData);
      
      // Create credential hash
      const credentialHash = this.web3.utils.keccak256(JSON.stringify(credentialData));

      // Issue credential on blockchain
      const tx = await this.credentialContract.methods.issueCredential(
        credentialHash,
        ipfsHash,
        credentialData.candidate,
        credentialData.credentialType,
        credentialData.institutionName
      ).send({
        from: this.accounts[0],
        gas: 500000
      });

      return {
        success: true,
        transactionHash: tx.transactionHash,
        credentialId: tx.events.CredentialIssued.returnValues.credentialId,
        ipfsHash,
        credentialHash
      };

    } catch (error) {
      console.error('Credential issuance failed:', error);
      throw error;
    }
  }

  // Register a resume on blockchain
  async registerResume(resumeData) {
    try {
      if (!this.resumeContract) {
        throw new Error('Resume contract not initialized');
      }

      // Upload resume to IPFS
      const ipfsHash = await this.uploadToIPFS(resumeData.file);
      
      // Create resume metadata
      const resumeMetadata = {
        name: resumeData.name,
        email: resumeData.email,
        skills: resumeData.skills,
        experienceYears: resumeData.experienceYears,
        education: resumeData.education,
        uploadedAt: new Date().toISOString()
      };

      // Upload metadata to IPFS
      const metadataHash = await this.uploadJSONToIPFS(resumeMetadata);
      
      // Create resume hash
      const resumeHash = this.web3.utils.keccak256(JSON.stringify(resumeMetadata));

      // Register resume on blockchain
      const tx = await this.resumeContract.methods.registerResume(
        resumeHash,
        ipfsHash,
        resumeData.skills,
        resumeData.experienceYears,
        resumeData.education,
        resumeData.isPublic || false
      ).send({
        from: this.accounts[0],
        gas: 800000
      });

      return {
        success: true,
        transactionHash: tx.transactionHash,
        resumeId: tx.events.ResumeRegistered.returnValues.resumeId,
        ipfsHash,
        metadataHash,
        resumeHash
      };

    } catch (error) {
      console.error('Resume registration failed:', error);
      throw error;
    }
  }

  // Verify a credential
  async verifyCredential(credentialId) {
    try {
      if (!this.credentialContract) {
        throw new Error('Credential contract not initialized');
      }

      const credential = await this.credentialContract.methods.getCredential(credentialId).call();
      
      // Download credential data from IPFS
      const credentialData = await this.downloadFromIPFS(credential.ipfsHash);
      
      return {
        success: true,
        credential: {
          id: credential.id.toString(),
          candidate: credential.candidate,
          issuer: credential.issuer,
          isVerified: credential.isVerified,
          credentialType: credential.credentialType,
          institutionName: credential.institutionName,
          // Convert BigInt to number for timestamp if needed
          timestamp: Number(credential.timestamp),
          data: JSON.parse(new TextDecoder().decode(credentialData))
        }
      };

    } catch (error) {
      console.error('Credential verification failed:', error);
      throw error;
    }
  }

  // Get candidate's resumes
  async getCandidateResumes(candidateAddress) {
    try {
      if (!this.resumeContract) {
        throw new Error('Resume contract not initialized');
      }

      const resumeIds = await this.resumeContract.methods.getCandidateResumes(candidateAddress).call();
      const resumes = [];

      for (const resumeId of resumeIds) {
        try {
          const resume = await this.resumeContract.methods.getResume(resumeId).call();
          resumes.push({
            id: resume.id,
            candidate: resume.candidate,
            timestamp: resume.timestamp,
            isActive: resume.isActive,
            skills: resume.skills,
            experienceYears: resume.experienceYears,
            education: resume.education,
            isPublic: resume.isPublic,
            ipfsHash: resume.ipfsHash
          });
        } catch (resumeError) {
          console.warn(`Could not fetch resume ${resumeId}:`, resumeError);
        }
      }

      return resumes;
    } catch (error) {
      console.error('Failed to get candidate resumes:', error);
      throw error;
    }
  }

  // Grant access to a recruiter
  async grantResumeAccess(resumeId, recruiterAddress) {
    try {
      if (!this.resumeContract) {
        throw new Error('Resume contract not initialized');
      }

      const tx = await this.resumeContract.methods.grantAccess(resumeId, recruiterAddress).send({
        from: this.accounts[0],
        gas: 200000
      });

      return {
        success: true,
        transactionHash: tx.transactionHash
      };
    } catch (error) {
      console.error('Failed to grant access:', error);
      throw error;
    }
  }

  // Setup event listeners for blockchain events
  setupEventListeners() {
    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        this.disconnect();
      } else {
        this.accounts = accounts;
      }
    });

    // Listen for network changes
    window.ethereum.on('chainChanged', (chainId) => {
      // Reload the page to avoid state inconsistencies
      window.location.reload();
    });
  }

  // Disconnect wallet
  disconnect() {
    this.web3 = null;
    this.accounts = [];
    this.credentialContract = null;
    this.resumeContract = null;
  }

  // Get current account
  getCurrentAccount() {
    return this.accounts.length > 0 ? this.accounts[0] : null;
  }

  // Check if connected
  isConnected() {
    return this.web3 !== null && this.accounts.length > 0;
  }
}

// Create singleton instance
const blockchainService = new BlockchainService();

export default blockchainService;