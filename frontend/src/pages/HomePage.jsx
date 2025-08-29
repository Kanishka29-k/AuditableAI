import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Brain, 
  Shield, 
  Zap, 
  Upload, 
  Search, 
  Star, 
  Users,
  CheckCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { ROUTES } from '../utils/constants';

const HomePage = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Matching",
      description: "Advanced NLP and machine learning algorithms analyze resumes and job descriptions for perfect matches",
      color: "blue"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Blockchain Verification",
      description: "Verify credentials authenticity using immutable blockchain technology and smart contracts",
      color: "green"
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: "Instant Results",
      description: "Get ranked candidate matches in seconds with detailed scoring and analysis",
      color: "purple"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Upload Resumes",
      description: "Upload candidate resumes in PDF, DOCX, or TXT format",
      icon: <Upload className="h-6 w-6" />,
      color: "blue"
    },
    {
      step: "2", 
      title: "AI Processing",
      description: "Our AI extracts skills, experience, and key information automatically",
      icon: <Brain className="h-6 w-6" />,
      color: "green"
    },
    {
      step: "3",
      title: "Job Matching", 
      description: "Input job requirements and get instant candidate rankings",
      icon: <Search className="h-6 w-6" />,
      color: "purple"
    },
    {
      step: "4",
      title: "Hire the Best",
      description: "Review matches, verify credentials, and make informed decisions",
      icon: <Star className="h-6 w-6" />,
      color: "orange"
    }
  ];

  const stats = [
    { label: "Resume Parsing Accuracy", value: "99.2%", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Matching Speed", value: "<2s", icon: <Zap className="h-5 w-5" /> },
    { label: "Hiring Efficiency", value: "+75%", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Candidate Satisfaction", value: "4.9/5", icon: <Award className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                AI-Powered
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Resume Screening
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Revolutionize your hiring process with blockchain-verified credentials 
                and intelligent candidate matching powered by advanced AI
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
              <Link
                to={ROUTES.UPLOAD}
                className="btn-primary inline-flex items-center justify-center text-lg px-8 py-4 transform hover:scale-105 transition-all duration-200"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to={ROUTES.ABOUT}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center mb-2 text-yellow-400">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-blue-100">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose AI ResumeMatch?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combine the power of AI, blockchain technology, and smart algorithms 
              to find the perfect candidates faster than ever before
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card p-8 text-center group hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, fast, and intelligent hiring process in just four steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className={`bg-gradient-to-r from-${step.color}-500 to-${step.color}-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 -ml-8" />
                  )}
                </div>
                <div className="card p-6 h-full">
                  <div className={`text-${step.color}-600 mb-4 flex justify-center`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Users className="h-16 w-16 mx-auto mb-6 text-blue-200" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join innovative companies already using AI ResumeMatch to find top talent 
            faster and more accurately than traditional methods
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.UPLOAD}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center transform hover:scale-105"
            >
              Start Screening Resumes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to={ROUTES.MATCHING}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
            >
              Try Job Matching
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;