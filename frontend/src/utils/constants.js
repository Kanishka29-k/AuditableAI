export const SUPPORTED_FILE_TYPES = {
    PDF: 'application/pdf',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    TXT: 'text/plain',
  };
  
  export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  export const SAMPLE_JOBS = [
    {
      title: "Senior Frontend Developer",
      description: "We're looking for a Senior Frontend Developer with 4+ years of experience in React, JavaScript, and modern web technologies. Experience with TypeScript, Node.js, and cloud platforms (AWS, Azure) is preferred. Bachelor's degree in Computer Science or related field required."
    },
    {
      title: "AI/ML Engineer",
      description: "Join our AI team! Seeking an experienced ML Engineer with 3+ years in Python, TensorFlow, PyTorch. Experience with deep learning, NLP, computer vision, and cloud ML services (AWS SageMaker, Azure ML). Strong background in statistics and data science required."
    },
    {
      title: "Full Stack Developer",
      description: "Looking for a Full Stack Developer with experience in JavaScript, React, Node.js, and databases (PostgreSQL, MongoDB). Knowledge of Docker, Kubernetes, and RESTful APIs. 2+ years of web development experience required."
    },
    {
      title: "Blockchain Developer",
      description: "Looking for a passionate Blockchain Developer to build the future of finance! Requirements: 2+ years of blockchain development experience, strong knowledge of Solidity and Ethereum, experience with Web3.js, Ethers.js, understanding of DeFi protocols and smart contracts, proficiency in JavaScript, Python, or Go, experience with IPFS and decentralized storage."
    },
    {
      title: "Data Scientist",
      description: "We're hiring a Data Scientist with 3+ years of experience in Python, R, SQL, and machine learning. Experience with pandas, numpy, scikit-learn, TensorFlow, and data visualization tools like Tableau or PowerBI. Strong statistical analysis skills and experience with big data technologies preferred."
    }
  ];
  
  export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  };
  
  export const ROUTES = {
    HOME: '/',
    UPLOAD: '/upload',
    CANDIDATES: '/candidates',
    MATCHING: '/matching',
    ANALYTICS: '/analytics',
    ABOUT: '/about',
  };
  
  export const SKILLS_CATEGORIES = {
    PROGRAMMING: ['python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust'],
    FRONTEND: ['react', 'angular', 'vue', 'html', 'css', 'typescript', 'next.js'],
    BACKEND: ['node.js', 'django', 'flask', 'spring', 'express', 'fastapi'],
    DATABASE: ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'elasticsearch'],
    CLOUD: ['aws', 'azure', 'gcp', 'docker', 'kubernetes'],
    AI_ML: ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy'],
    BLOCKCHAIN: ['blockchain', 'solidity', 'ethereum', 'web3', 'smart contracts'],
  };
  
  export const DEFAULT_MATCH_WEIGHTS = {
    skills: 0.4,
    semantic: 0.4,
    experience: 0.2,
  };