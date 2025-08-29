import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { Separator } from './components/ui/separator';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import CandidatesPage from './pages/CandidatesPage';
import MatchingPage from './pages/MatchingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AboutPage from './pages/AboutPage';
import { useNotification } from './hooks/useNotifications';
import { api } from './utils/api';
import BlockchainPage from './pages/BlockchainPage';
import { 
  Brain, 
  Home, 
  UserPlus, 
  Users, 
  Briefcase, 
  BarChart3, 
  Globe, 
  Menu, 
  Shield,
  X,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

// Notification Component with shadcn/ui
const ShadcnNotification = ({ notification }) => {
  if (!notification) return null;

  const { message, type } = notification;

  return (
    <div className="fixed top-20 right-4 z-50 w-96">
      <Alert className={`${
        type === 'success' ? 'border-green-500 text-green-700' : 
        type === 'error' ? 'border-red-500 text-red-700' : 
        'border-blue-500 text-blue-700'
      }`}>
        {type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
};

// Navigation Component with shadcn/ui
const ShadcnNavbar = ({ currentPage, setCurrentPage, candidatesCount, mobileMenuOpen, setMobileMenuOpen }) => {
  const navItems = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'upload', name: 'Upload', icon: UserPlus },
    { id: 'candidates', name: 'Candidates', icon: Users, badge: candidatesCount },
    { id: 'matching', name: 'Matching', icon: Briefcase },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'about', name: 'About', icon: Globe },
    { id: 'blockchain', name: 'Blockchain', icon: Shield },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentPage('home')}
              className="flex items-center space-x-2 p-0 hover:bg-transparent"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI ResumeMatch
              </span>
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                onClick={() => setCurrentPage(item.id)}
                className="flex items-center space-x-2"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-2">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge variant="secondary">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Footer Component with shadcn/ui
const ShadcnFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AI ResumeMatch</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Revolutionizing recruitment with AI-powered candidate matching and blockchain-verified credentials.
            </p>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center">
          <p className="text-gray-400">
            © {currentYear} AI ResumeMatch. Built with React, FastAPI, and Blockchain Technology.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            College Project - Decentralized AI-Powered Resume Screening System
          </p>
        </div>
      </div>
    </footer>
  );
};

// Simple HomePage with shadcn/ui
const ShadcnHomePage = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                onClick={() => setCurrentPage('upload')}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentPage('about')}
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose AI ResumeMatch?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  <span>AI-Powered Matching</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced algorithms for perfect candidate matches using semantic similarity and machine learning.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-green-600" />
                  <span>Blockchain Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Immutable credential verification using smart contracts and decentralized storage.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span>Instant Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get ranked candidate matches in seconds with detailed scoring and analysis.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { notification, showNotification } = useNotification();

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await api.getCandidates();
      setCandidates(data.candidates || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      showNotification('Error fetching candidates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage !== 'home') {
      fetchCandidates();
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <ShadcnHomePage setCurrentPage={setCurrentPage} />;
      case 'upload':
        return (
          <UploadPage 
            onUploadSuccess={() => {
              fetchCandidates();
              showNotification('Resume uploaded successfully!');
            }} 
            showNotification={showNotification}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case 'candidates':
        return (
          <CandidatesPage 
            candidates={candidates}
            onCandidateDelete={fetchCandidates}
            showNotification={showNotification}
            loading={loading}
          />
        );
      case 'matching':
        return (
          <MatchingPage 
            candidates={candidates}
            showNotification={showNotification}
          />
        );
      case 'blockchain':
        return <BlockchainPage candidates={candidates} />;
      case 'analytics':
        return <AnalyticsPage candidates={candidates} />;
      case 'about':
        return <AboutPage />;
      default:
        return <ShadcnHomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <ShadcnNavbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        candidatesCount={candidates.length}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Notification */}
      <ShadcnNotification notification={notification} />

      {/* Main Content */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Footer */}
      <ShadcnFooter />
    </div>
  );
}

export default App;