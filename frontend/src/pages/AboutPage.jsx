import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Shield, 
  Zap, 
  Upload, 
  Search, 
  Star, 
  Users,
  Globe,
  Github,
  Mail,
  Award,
  Code,
  Database,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Target,
  Lightbulb,
  Heart,
  Rocket
} from 'lucide-react';
import { ROUTES } from '../utils/constants';

const AboutPage = () => {
  const features = [
    {
      icon: <Brain className="h-12 w-12 text-blue-600" />,
      title: "Advanced AI Technology",
      description: "Leveraging state-of-the-art NLP models including BERT and Sentence Transformers for semantic understanding and accurate candidate-job matching.",
      technologies: ["BERT", "spaCy", "Sentence Transformers", "scikit-learn"]
    },
    {
      icon: <Shield className="h-12 w-12 text-green-600" />,
      title: "Blockchain Security",
      description: "Immutable credential verification using Ethereum smart contracts and IPFS storage ensuring authenticity and preventing fraud.",
      technologies: ["Ethereum", "Solidity", "IPFS", "MetaMask"]
    },
    {
      icon: <Zap className="h-12 w-12 text-purple-600" />,
      title: "Lightning Fast Performance",
      description: "Modern architecture built with FastAPI and React delivering sub-second response times for resume parsing and candidate matching.",
      technologies: ["FastAPI", "React", "Vite", "TailwindCSS"]
    }
  ];

  const techStack = {
    frontend: [
      { name: "React 18", description: "Modern UI library with hooks" },
      { name: "Vite", description: "Next-generation frontend tooling" },
      { name: "TailwindCSS", description: "Utility-first CSS framework" },
      { name: "React Router", description: "Client-side routing" }
    ],
    backend: [
      { name: "FastAPI", description: "High-performance Python web framework" },
      { name: "Python 3.9+", description: "Core backend language" },
      { name: "spaCy", description: "Industrial-strength NLP" },
      { name: "PostgreSQL", description: "Robust relational database" }
    ],
    ai: [
      { name: "BERT", description: "Transformer-based language model" },
      { name: "Sentence Transformers", description: "Semantic similarity matching" },
      { name: "scikit-learn", description: "Machine learning utilities" },
      { name: "TensorFlow", description: "Deep learning framework" }
    ],
    blockchain: [
      { name: "Ethereum", description: "Decentralized platform" },
      { name: "Solidity", description: "Smart contract language" },
      { name: "IPFS", description: "Decentralized storage" },
      { name: "Web3.js", description: "Ethereum JavaScript API" }
    ]
  };

  const teamMembers = [
    {
      role: "AI/ML Engineer",
      icon: <Brain className="h-8 w-8" />,
      description: "Developing advanced machine learning algorithms for resume parsing and semantic matching",
      skills: ["Python", "TensorFlow", "NLP", "Data Science"],
      color: "blue"
    },
    {
      role: "Blockchain Developer", 
      icon: <Shield className="h-8 w-8" />,
      description: "Building secure smart contracts and decentralized credential verification systems",
      skills: ["Solidity", "Ethereum", "Web3", "IPFS"],
      color: "green"
    },
    {
      role: "Full-Stack Developer",
      icon: <Code className="h-8 w-8" />,
      description: "Creating responsive user interfaces and robust backend APIs for seamless user experience",
      skills: ["React", "FastAPI", "PostgreSQL", "DevOps"],
      color: "purple"
    }
  ];

  const projectTimeline = [
    {
      phase: "Research & Planning",
      duration: "Week 1-2",
      description: "Technology research, system architecture design, and project planning",
      status: "completed"
    },
    {
      phase: "AI Development",
      duration: "Week 3-6", 
      description: "Resume parsing, NLP models, and matching algorithms implementation",
      status: "completed"
    },
    {
      phase: "Backend Development",
      duration: "Week 5-8",
      description: "FastAPI implementation, database design, and API development",
      status: "completed"
    },
    {
      phase: "Frontend Development",
      duration: "Week 7-10",
      description: "React application, user interface, and user experience design",
      status: "completed"
    },
    {
      phase: "Blockchain Integration",
      duration: "Week 9-12",
      description: "Smart contracts, IPFS integration, and credential verification",
      status: "in-progress"
    },
    {
      phase: "Testing & Deployment",
      duration: "Week 11-14",
      description: "System testing, optimization, and production deployment",
      status: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About AI ResumeMatch</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              A revolutionary college project combining artificial intelligence and blockchain 
              technology to transform the recruitment landscape
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.UPLOAD} className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              Try the Platform
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a 
              href="#tech-stack" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
            >
              Explore Technology
            </a>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Target className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're transforming the hiring landscape by combining cutting-edge artificial intelligence 
              with blockchain technology to create the most accurate, efficient, and trustworthy 
              recruitment platform. Our goal is to help companies find the perfect candidates faster 
              while ensuring credential authenticity through decentralized verification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">Pushing the boundaries of what's possible in recruitment technology</p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Impact</h3>
              <p className="text-gray-600">Making hiring more fair, efficient, and accessible for everyone</p>
            </div>
            <div className="text-center">
              <Rocket className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">Delivering high-quality solutions with cutting-edge technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Revolutionary Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combining the latest advances in AI, machine learning, and blockchain technology
            </p>
          </div>

          <div className="space-y-16">
            {features.map((feature, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1 lg:max-w-md">
                  <div className="card p-8">
                    <div className="text-center">
                      {feature.icon}
                      <h4 className="text-lg font-semibold text-gray-900 mt-4">
                        {feature.title.split(' ').slice(-1)[0]} in Action
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="tech-stack" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Technology Stack</h2>
            <p className="text-xl text-gray-600">
              Built with modern, cutting-edge technologies for optimal performance and scalability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Smartphone className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Frontend</h3>
              </div>
              <div className="space-y-3">
                {techStack.frontend.map((tech, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{tech.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Backend</h3>
              </div>
              <div className="space-y-3">
                {techStack.backend.map((tech, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{tech.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">AI/ML</h3>
              </div>
              <div className="space-y-3">
                {techStack.ai.map((tech, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{tech.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Blockchain</h3>
              </div>
              <div className="space-y-3">
                {techStack.blockchain.map((tech, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{tech.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Development Team</h2>
            <p className="text-xl text-gray-600">
              A multidisciplinary team combining expertise in AI, blockchain, and full-stack development
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card p-8 text-center hover:shadow-lg transition-shadow">
                <div className={`w-20 h-20 bg-gradient-to-r from-${member.color}-500 to-${member.color}-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white`}>
                  {member.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{member.role}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{member.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {member.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className={`px-3 py-1 bg-${member.color}-100 text-${member.color}-800 text-sm font-medium rounded-full`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Project Timeline</h2>
            <p className="text-xl text-gray-600">
              A systematic approach to building a comprehensive AI-powered recruitment platform
            </p>
          </div>

          <div className="space-y-8">
            {projectTimeline.map((phase, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    phase.status === 'completed' ? 'bg-green-500' :
                    phase.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {phase.status === 'completed' ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <span className="text-white font-bold">{index + 1}</span>
                    )}
                  </div>
                  {index < projectTimeline.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-300 mx-auto mt-2"></div>
                  )}
                </div>
                <div className="flex-1 card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{phase.phase}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                        phase.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {phase.status.replace('-', ' ')}
                      </span>
                      <span className="text-sm text-gray-600">{phase.duration}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Impact */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Award className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Project Impact & Goals</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              This college project aims to address real-world challenges in recruitment 
              while demonstrating advanced technical capabilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Academic Goals</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Apply machine learning and NLP techniques to solve real problems</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Demonstrate understanding of blockchain and decentralized systems</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Build full-stack applications with modern web technologies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Integrate multiple complex systems into a cohesive platform</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Real-World Impact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Reduce bias in hiring through objective AI analysis</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Improve hiring efficiency and reduce time-to-hire</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Prevent credential fraud through blockchain verification</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Provide valuable insights through advanced analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Resources */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-300 mb-8">
              Interested in our project? Want to collaborate or learn more about our technology?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-300">contact@airesumematch.com</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Github className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">GitHub</h3>
              <p className="text-gray-300">github.com/ai-resume-match</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Documentation</h3>
              <p className="text-gray-300">docs.airesumematch.com</p>
            </div>
          </div>

          <div className="text-center border-t border-gray-800 pt-8">
            <p className="text-gray-400 mb-4">
              This is a college project demonstrating advanced concepts in AI, blockchain, and full-stack development.
            </p>
            <div className="flex justify-center space-x-6">
              <Link to={ROUTES.UPLOAD} className="text-blue-400 hover:text-blue-300 transition-colors">
                Try the Platform
              </Link>
              <Link to={ROUTES.MATCHING} className="text-green-400 hover:text-green-300 transition-colors">
                Test AI Matching
              </Link>
              <Link to={ROUTES.ANALYTICS} className="text-purple-400 hover:text-purple-300 transition-colors">
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;