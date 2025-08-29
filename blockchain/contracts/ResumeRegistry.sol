// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ResumeRegistry
 * @dev Smart contract for registering and managing resume metadata on blockchain
 * @author AI ResumeMatch Team
 */
contract ResumeRegistry is Ownable {
    
    // Counter for resume IDs
    uint256 private _resumeIdCounter;
    
    // Struct to store resume information
    struct Resume {
        uint256 id;
        bytes32 resumeHash;         // Hash of the resume content
        string ipfsHash;            // IPFS hash for storing resume file
        address candidate;          // Address of the resume owner
        uint256 timestamp;          // When the resume was registered
        bool isActive;              // Whether the resume is active
        string[] skills;            // List of skills extracted
        uint256 experienceYears;    // Years of experience
        string education;           // Education details
        bool isPublic;              // Whether resume is publicly viewable
    }
    
    // Struct for candidate profile
    struct CandidateProfile {
        string name;
        string email;
        bool isVerified;
        uint256 registrationDate;
        uint256[] resumeIds;
        uint256 totalViews;
    }
    
    // Mappings
    mapping(uint256 => Resume) public resumes;
    mapping(bytes32 => uint256) public hashToResumeId;
    mapping(address => CandidateProfile) public candidates;
    mapping(address => uint256[]) public candidateResumes;
    mapping(address => mapping(address => bool)) public resumeAccessPermissions;
    
    // Events
    event ResumeRegistered(
        uint256 indexed resumeId,
        bytes32 indexed resumeHash,
        address indexed candidate,
        string ipfsHash
    );
    
    event ResumeUpdated(
        uint256 indexed resumeId,
        address indexed candidate
    );
    
    event AccessGranted(
        uint256 indexed resumeId,
        address indexed candidate,
        address indexed recruiter
    );
    
    event AccessRevoked(
        uint256 indexed resumeId,
        address indexed candidate,
        address indexed recruiter
    );
    
    event ProfileUpdated(
        address indexed candidate,
        string name,
        string email
    );
    
    // Modifiers
    modifier onlyResumeOwner(uint256 _resumeId) {
        require(resumes[_resumeId].candidate == msg.sender, "Not the resume owner");
        _;
    }
    
    modifier resumeExists(uint256 _resumeId) {
        require(_resumeId <= _resumeIdCounter && _resumeId > 0, "Resume does not exist");
        _;
    }
    
    modifier hasAccess(uint256 _resumeId) {
        Resume memory resume = resumes[_resumeId];
        require(
            resume.candidate == msg.sender || 
            resume.isPublic || 
            resumeAccessPermissions[resume.candidate][msg.sender] ||
            msg.sender == owner(),
            "Access denied"
        );
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
    
    /**
    * @dev Constructor - using new constructor syntax
    */
    constructor() Ownable(msg.sender) {
        _resumeIdCounter = 0;
    }
    
    /**
     * @dev Register a new resume on the blockchain
     * @param _resumeHash Hash of the resume content
     * @param _ipfsHash IPFS hash of the resume file
     * @param _skills Array of skills
     * @param _experienceYears Years of experience
     * @param _education Education details
     * @param _isPublic Whether the resume should be publicly viewable
     */
    function registerResume(
        bytes32 _resumeHash,
        string memory _ipfsHash,
        string[] memory _skills,
        uint256 _experienceYears,
        string memory _education,
        bool _isPublic
    ) external nonReentrant returns (uint256) {
        require(_resumeHash != bytes32(0), "Invalid resume hash");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(hashToResumeId[_resumeHash] == 0, "Resume already registered");
        
        // Increment resume counter
        _resumeIdCounter++;
        uint256 newResumeId = _resumeIdCounter;
        
        // Create new resume
        resumes[newResumeId] = Resume({
            id: newResumeId,
            resumeHash: _resumeHash,
            ipfsHash: _ipfsHash,
            candidate: msg.sender,
            timestamp: block.timestamp,
            isActive: true,
            skills: _skills,
            experienceYears: _experienceYears,
            education: _education,
            isPublic: _isPublic
        });
        
        // Map hash to ID
        hashToResumeId[_resumeHash] = newResumeId;
        
        // Add to candidate's resume list
        candidateResumes[msg.sender].push(newResumeId);
        candidates[msg.sender].resumeIds.push(newResumeId);
        
        // Initialize candidate profile if first resume
        if (candidates[msg.sender].registrationDate == 0) {
            candidates[msg.sender].registrationDate = block.timestamp;
            candidates[msg.sender].isVerified = false;
            candidates[msg.sender].totalViews = 0;
        }
        
        emit ResumeRegistered(newResumeId, _resumeHash, msg.sender, _ipfsHash);
        
        return newResumeId;
    }
    
    /**
     * @dev Update resume information
     * @param _resumeId ID of the resume to update
     * @param _skills Updated skills array
     * @param _experienceYears Updated years of experience
     * @param _education Updated education details
     * @param _isPublic Updated public visibility
     */
    function updateResume(
        uint256 _resumeId,
        string[] memory _skills,
        uint256 _experienceYears,
        string memory _education,
        bool _isPublic
    ) external resumeExists(_resumeId) onlyResumeOwner(_resumeId) {
        Resume storage resume = resumes[_resumeId];
        
        resume.skills = _skills;
        resume.experienceYears = _experienceYears;
        resume.education = _education;
        resume.isPublic = _isPublic;
        
        emit ResumeUpdated(_resumeId, msg.sender);
    }
    
    /**
     * @dev Get resume details (with access control)
     * @param _resumeId ID of the resume
     */
    function getResume(uint256 _resumeId) 
        external 
        view 
        resumeExists(_resumeId) 
        hasAccess(_resumeId)
        returns (Resume memory) 
    {
        return resumes[_resumeId];
    }
    
    /**
     * @dev Get all resumes for a candidate
     * @param _candidate Address of the candidate
     */
    function getCandidateResumes(address _candidate) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return candidateResumes[_candidate];
    }
    
    /**
     * @dev Grant access to a specific recruiter for a resume
     * @param _resumeId ID of the resume
     * @param _recruiter Address of the recruiter
     */
    function grantAccess(uint256 _resumeId, address _recruiter) 
        external 
        resumeExists(_resumeId) 
        onlyResumeOwner(_resumeId) 
    {
        require(_recruiter != address(0), "Invalid recruiter address");
        require(_recruiter != msg.sender, "Cannot grant access to yourself");
        
        resumeAccessPermissions[msg.sender][_recruiter] = true;
        
        emit AccessGranted(_resumeId, msg.sender, _recruiter);
    }
    
    /**
     * @dev Revoke access from a recruiter for a resume
     * @param _resumeId ID of the resume
     * @param _recruiter Address of the recruiter
     */
    function revokeAccess(uint256 _resumeId, address _recruiter) 
        external 
        resumeExists(_resumeId) 
        onlyResumeOwner(_resumeId) 
    {
        resumeAccessPermissions[msg.sender][_recruiter] = false;
        
        emit AccessRevoked(_resumeId, msg.sender, _recruiter);
    }
    
    /**
     * @dev Update candidate profile
     * @param _name Candidate's name
     * @param _email Candidate's email
     */
    function updateProfile(string memory _name, string memory _email) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        
        CandidateProfile storage profile = candidates[msg.sender];
        
        if (profile.registrationDate == 0) {
            profile.registrationDate = block.timestamp;
        }
        
        profile.name = _name;
        profile.email = _email;
        
        emit ProfileUpdated(msg.sender, _name, _email);
    }
    
    /**
     * @dev Verify a candidate's profile (only owner)
     * @param _candidate Address of the candidate to verify
     */
    function verifyCandidate(address _candidate) external onlyOwner {
        require(candidates[_candidate].registrationDate > 0, "Candidate not registered");
        candidates[_candidate].isVerified = true;
    }
    
    /**
     * @dev Get candidate profile
     * @param _candidate Address of the candidate
     */
    function getCandidateProfile(address _candidate) 
        external 
        view 
        returns (CandidateProfile memory) 
    {
        return candidates[_candidate];
    }
    
    /**
     * @dev Check if recruiter has access to candidate's resumes
     * @param _candidate Candidate address
     * @param _recruiter Recruiter address
     */
    function hasResumeAccess(address _candidate, address _recruiter) 
        external 
        view 
        returns (bool) 
    {
        return resumeAccessPermissions[_candidate][_recruiter];
    }
    
    /**
     * @dev Get total number of resumes registered
     */
    function getTotalResumes() external view returns (uint256) {
        return _resumeIdCounter;
    }
    
    /**
     * @dev Deactivate a resume
     * @param _resumeId ID of the resume to deactivate
     */
    function deactivateResume(uint256 _resumeId) 
        external 
        resumeExists(_resumeId) 
        onlyResumeOwner(_resumeId) 
    {
        resumes[_resumeId].isActive = false;
    }
    
    /**
     * @dev Activate a resume
     * @param _resumeId ID of the resume to activate
     */
    function activateResume(uint256 _resumeId) 
        external 
        resumeExists(_resumeId) 
        onlyResumeOwner(_resumeId) 
    {
        resumes[_resumeId].isActive = true;
    }
}