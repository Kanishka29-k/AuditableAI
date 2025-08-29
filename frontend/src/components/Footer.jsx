import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Globe, Github, Linkedin, Mail } from 'lucide-react';
import { ROUTES } from '../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    features: [
      { name: 'Resume Parsing', href: ROUTES.UPLOAD },
      { name: 'AI Matching', href: ROUTES.MATCHING },
      { name: 'Blockchain Verification', href: ROUTES.ABOUT },
      { name: 'Analytics Dashboard', href: ROUTES.ANALYTICS },
    ],
    technology: [
      { name: 'Machine Learning', href: ROUTES.ABOUT },
      { name: 'Natural Language Processing', href: ROUTES.ABOUT },
      { name: 'Smart Contracts', href: ROUTES.ABOUT },
      { name: 'IPFS Storage', href: ROUTES.ABOUT },
    ],
    company: [
      { name: 'About Us', href: ROUTES.ABOUT },
      { name: 'How It Works', href: ROUTES.HOME },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'Website', icon: Globe, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@airesumematch.com' },
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AI ResumeMatch</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Revolutionizing recruitment with AI-powered candidate matching and 
              blockchain-verified credentials. Find the perfect talent faster and more accurately.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors group"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Features</h3>
            <ul className="space-y-3">
              {footerLinks.features.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Technology</h3>
            <ul className="space-y-3">
              {footerLinks.technology.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} AI ResumeMatch. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Built with React, FastAPI, and Blockchain Technology
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-500 text-xs text-center md:text-right">
                College Project - Decentralized AI-Powered Resume Screening System
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;