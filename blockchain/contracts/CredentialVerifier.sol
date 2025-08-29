// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CredentialVerifier
 * @dev Smart contract for verifying and storing credential hashes on blockchain
 * @author AI ResumeMatch Team
 */
contract CredentialVerifier is Ownable {
    
    // Counter for credential IDs
    uint256 private _credentialIdCounter;
    
    // Struct to store credential information
    struct Credential {
        uint256 id;
        bytes32 credentialHash;     // Hash of the credential data
        string ipfsHash;            // IPFS hash for storing credential file
        address candidate;          // Address of the credential owner
        address issuer;             // Address of the credential issuer
        uint256 timestamp;          // When the credential was issued
        bool isVerified;            // Verification status
        string credentialType;      // Type of credential (degree, certificate, etc.)
        string institutionName;     // Name of issuing institution
    }
    
    // Struct for issuer information
    struct Issuer {
        string name;
        string website;
        bool isAuthorized;
        uint256 registrationDate;
    }
    
    // Mapping from credential ID to credential details
    mapping(uint256 => Credential) public credentials;
    
    // Mapping from credential hash to credential ID (prevents duplicates)
    mapping(bytes32 => uint256) public hashToCredentialId;
    
    // Mapping from candidate address to their credential IDs
    mapping(address => uint256[]) public candidateCredentials;
    
    // Mapping from issuer address to issuer details
    mapping(address => Issuer) public issuers;
    
    // Mapping to track authorized issuers
    mapping(address => bool) public authorizedIssuers;
    
    // Events
    event CredentialIssued(
        uint256 indexed credentialId,
        bytes32 indexed credentialHash,
        address indexed candidate,
        address issuer,
        string credentialType
    );
    
    event CredentialVerified(
        uint256 indexed credentialId,
        address indexed verifier
    );
    
    event IssuerAuthorized(
        address indexed issuer,
        string name
    );
    
    event IssuerRevoked(
        address indexed issuer
    );
    
    // Modifiers
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender], "Not an authorized issuer");
        _;
    }
    
    modifier credentialExists(uint256 _credentialId) {
        require(_credentialId <= _credentialIdCounter && _credentialId > 0, "Credential does not exist");
        _;
    }
    
    // Reentrancy protection
    bool private _locked;
    modifier nonReentrant() {
        require(!_locked, "ReentrancyGuard: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }
    
    constructor() Ownable(msg.sender) {
        // Owner is automatically an authorized issuer
        authorizedIssuers[msg.sender] = true;
        issuers[msg.sender] = Issuer({
            name: "AI ResumeMatch Admin",
            website: "https://airesumematch.com",
            isAuthorized: true,
            registrationDate: block.timestamp
        });
        _credentialIdCounter = 0;
    }
    
    /**
     * @dev Issue a new credential
     * @param _credentialHash Hash of the credential data
     * @param _ipfsHash IPFS hash of the credential file
     * @param _candidate Address of the credential owner
     * @param _credentialType Type of credential
     * @param _institutionName Name of issuing institution
     */
    function issueCredential(
        bytes32 _credentialHash,
        string memory _ipfsHash,
        address _candidate,
        string memory _credentialType,
        string memory _institutionName
    ) external onlyAuthorizedIssuer nonReentrant returns (uint256) {
        require(_candidate != address(0), "Invalid candidate address");
        require(_credentialHash != bytes32(0), "Invalid credential hash");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(_credentialType).length > 0, "Credential type cannot be empty");
        
        // Check if credential already exists
        require(hashToCredentialId[_credentialHash] == 0, "Credential already exists");
        
        // Increment credential counter
        _credentialIdCounter++;
        uint256 newCredentialId = _credentialIdCounter;
        
        // Create new credential
        credentials[newCredentialId] = Credential({
            id: newCredentialId,
            credentialHash: _credentialHash,
            ipfsHash: _ipfsHash,
            candidate: _candidate,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isVerified: true, // Automatically verified when issued by authorized issuer
            credentialType: _credentialType,
            institutionName: _institutionName
        });
        
        // Map hash to ID
        hashToCredentialId[_credentialHash] = newCredentialId;
        
        // Add to candidate's credential list
        candidateCredentials[_candidate].push(newCredentialId);
        
        emit CredentialIssued(
            newCredentialId,
            _credentialHash,
            _candidate,
            msg.sender,
            _credentialType
        );
        
        return newCredentialId;
    }
    
    /**
     * @dev Verify a credential by ID
     * @param _credentialId ID of the credential to verify
     */
    function verifyCredential(uint256 _credentialId) 
        external 
        credentialExists(_credentialId) 
        returns (bool) 
    {
        Credential storage credential = credentials[_credentialId];
        
        // Only issuer or owner can verify
        require(
            msg.sender == credential.issuer || 
            msg.sender == credential.candidate || 
            msg.sender == owner(),
            "Not authorized to verify this credential"
        );
        
        credential.isVerified = true;
        
        emit CredentialVerified(_credentialId, msg.sender);
        
        return true;
    }
    
    /**
     * @dev Get credential details by ID
     * @param _credentialId ID of the credential
     */
    function getCredential(uint256 _credentialId) 
        external 
        view 
        credentialExists(_credentialId) 
        returns (Credential memory) 
    {
        return credentials[_credentialId];
    }
    
    /**
     * @dev Get all credentials for a candidate
     * @param _candidate Address of the candidate
     */
    function getCandidateCredentials(address _candidate) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return candidateCredentials[_candidate];
    }
    
    /**
     * @dev Verify credential by hash
     * @param _credentialHash Hash of the credential
     */
    function verifyCredentialByHash(bytes32 _credentialHash) 
        external 
        view 
        returns (bool exists, bool isVerified, address issuer) 
    {
        uint256 credentialId = hashToCredentialId[_credentialHash];
        
        if (credentialId == 0) {
            return (false, false, address(0));
        }
        
        Credential memory credential = credentials[credentialId];
        return (true, credential.isVerified, credential.issuer);
    }
    
    /**
     * @dev Authorize a new issuer (only owner)
     * @param _issuer Address of the new issuer
     * @param _name Name of the issuer
     * @param _website Website of the issuer
     */
    function authorizeIssuer(
        address _issuer,
        string memory _name,
        string memory _website
    ) external onlyOwner {
        require(_issuer != address(0), "Invalid issuer address");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        authorizedIssuers[_issuer] = true;
        issuers[_issuer] = Issuer({
            name: _name,
            website: _website,
            isAuthorized: true,
            registrationDate: block.timestamp
        });
        
        emit IssuerAuthorized(_issuer, _name);
    }
    
    /**
     * @dev Revoke issuer authorization (only owner)
     * @param _issuer Address of the issuer to revoke
     */
    function revokeIssuer(address _issuer) external onlyOwner {
        require(authorizedIssuers[_issuer], "Issuer not authorized");
        require(_issuer != owner(), "Cannot revoke owner");
        
        authorizedIssuers[_issuer] = false;
        issuers[_issuer].isAuthorized = false;
        
        emit IssuerRevoked(_issuer);
    }
    
    /**
     * @dev Get total number of credentials issued
     */
    function getTotalCredentials() external view returns (uint256) {
        return _credentialIdCounter;
    }
    
    /**
     * @dev Get issuer details
     * @param _issuer Address of the issuer
     */
    function getIssuer(address _issuer) external view returns (Issuer memory) {
        return issuers[_issuer];
    }
    
    /**
     * @dev Check if an address is an authorized issuer
     * @param _issuer Address to check
     */
    function isAuthorizedIssuer(address _issuer) external view returns (bool) {
        return authorizedIssuers[_issuer];
    }
}