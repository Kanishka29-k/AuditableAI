import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { useBlockchain } from '../hooks/useBlockchain';
import { 
  Wallet, 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Upload,
  Eye,
  Award,
  Link as LinkIcon,
  Copy,
  Clock,
  User
} from 'lucide-react';

const BlockchainPage = ({ candidates }) => {
  const {
    isConnected,
    account,
    network,
    loading,
    error,
    connectWallet,
    disconnect,
    switchNetwork,
    issueCredential,
    registerResume,
    verifyCredential,
    getCandidateResumes,
    grantResumeAccess,
    isMetaMaskInstalled
  } = useBlockchain();

  const [activeTab, setActiveTab] = useState('wallet');
  const [credentialForm, setCredentialForm] = useState({
    candidate: '',
    credentialType: '',
    institutionName: '',
    degree: '',
    completionDate: '',
    grade: ''
  });
  const [verificationId, setVerificationId] = useState('');
  const [verifiedCredential, setVerifiedCredential] = useState(null);
  const [candidateResumes, setCandidateResumes] = useState([]);

  // Reset error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        // setError(null); // This would need to be implemented in the hook
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork('GANACHE');
    } catch (err) {
      console.error('Network switch failed:', err);
    }
  };

  const handleIssueCredential = async (e) => {
    e.preventDefault();
    try {
      const result = await issueCredential({
        candidate: credentialForm.candidate,
        credentialType: credentialForm.credentialType,
        institutionName: credentialForm.institutionName,
        degree: credentialForm.degree,
        completionDate: credentialForm.completionDate,
        grade: credentialForm.grade,
        issuedBy: account,
        issuedAt: new Date().toISOString()
      });
      
      alert(`Credential issued successfully!\nTransaction: ${result.transactionHash}`);
      setCredentialForm({
        candidate: '',
        credentialType: '',
        institutionName: '',
        degree: '',
        completionDate: '',
        grade: ''
      });
    } catch (err) {
      console.error('Credential issuance failed:', err);
    }
  };

  const handleVerifyCredential = async (e) => {
        e.preventDefault();
        try {
            // Convert the input string to a BigInt
            const idAsBigInt = BigInt(verificationId);
            
            // Pass the BigInt to the verifyCredential function
            const result = await verifyCredential(idAsBigInt);
            setVerifiedCredential(result.credential);
        } catch (err) {
            console.error('Credential verification failed:', err);
            setVerifiedCredential(null);
        }
    };

  const handleGetCandidateResumes = async (candidateAddress) => {
    try {
      const resumes = await getCandidateResumes(candidateAddress);
      setCandidateResumes(resumes);
    } catch (err) {
      console.error('Failed to get candidate resumes:', err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="h-10 w-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">MetaMask Required</h1>
          <p className="text-lg text-gray-600 mb-8">
            To use blockchain features, you need to install MetaMask browser extension.
          </p>
          <Button 
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Install MetaMask
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Shield className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blockchain Credential Verification</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Secure, immutable credential verification using Ethereum smart contracts and IPFS storage.
          Issue, verify, and manage educational and professional credentials on the blockchain.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-500 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Wallet Connection Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Wallet Connection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="space-y-4">
              <p className="text-gray-600">Connect your MetaMask wallet to access blockchain features.</p>
              <Button onClick={handleConnectWallet} disabled={loading}>
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {truncateAddress(account)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(account)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {network && (
                    <p className="text-xs text-gray-500 mt-1">
                      Network: {network.name}
                    </p>
                  )}
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={handleSwitchNetwork}>
                    Switch to Ganache
                  </Button>
                  <Button variant="outline" size="sm" onClick={disconnect}>
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <>
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'issue', name: 'Issue Credential', icon: Award },
              { id: 'verify', name: 'Verify Credential', icon: CheckCircle },
         
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1"
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </Button>
            ))}
          </div>

          {/* Issue Credential Tab */}
          {activeTab === 'issue' && (
            <Card>
              <CardHeader>
                <CardTitle>Issue New Credential</CardTitle>
                <CardDescription>
                  Issue a verified credential on the blockchain for a candidate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleIssueCredential} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="candidate">Candidate Address</Label>
                      <Input
                        id="candidate"
                        type="text"
                        placeholder="0x..."
                        value={credentialForm.candidate}
                        onChange={(e) => setCredentialForm({
                          ...credentialForm,
                          candidate: e.target.value
                        })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="credentialType">Credential Type</Label>
                      <Select 
                        value={credentialForm.credentialType}
                        onValueChange={(value) => setCredentialForm({
                          ...credentialForm,
                          credentialType: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select credential type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="degree">University Degree</SelectItem>
                          <SelectItem value="certificate">Professional Certificate</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="training">Training Certificate</SelectItem>
                          <SelectItem value="license">Professional License</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institutionName">Institution Name</Label>
                      <Input
                        id="institutionName"
                        type="text"
                        placeholder="University/Institution name"
                        value={credentialForm.institutionName}
                        onChange={(e) => setCredentialForm({
                          ...credentialForm,
                          institutionName: e.target.value
                        })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree/Certificate Name</Label>
                      <Input
                        id="degree"
                        type="text"
                        placeholder="e.g., Bachelor of Computer Science"
                        value={credentialForm.degree}
                        onChange={(e) => setCredentialForm({
                          ...credentialForm,
                          degree: e.target.value
                        })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="completionDate">Completion Date</Label>
                      <Input
                        id="completionDate"
                        type="date"
                        value={credentialForm.completionDate}
                        onChange={(e) => setCredentialForm({
                          ...credentialForm,
                          completionDate: e.target.value
                        })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade/Score (optional)</Label>
                      <Input
                        id="grade"
                        type="text"
                        placeholder="e.g., First Class, 3.8 GPA"
                        value={credentialForm.grade}
                        onChange={(e) => setCredentialForm({
                          ...credentialForm,
                          grade: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Clock className="animate-spin h-4 w-4 mr-2" />
                        Issuing Credential...
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Issue Credential
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Verify Credential Tab */}
          {activeTab === 'verify' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verify Credential</CardTitle>
                  <CardDescription>
                    Enter a credential ID to verify its authenticity on the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVerifyCredential} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="credentialId">Credential ID</Label>
                      <Input
                        id="credentialId"
                        type="text"
                        placeholder="Enter credential ID"
                        value={verificationId}
                        onChange={(e) => setVerificationId(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Clock className="animate-spin h-4 w-4 mr-2" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify Credential
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Verification Results */}
              {verifiedCredential && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Credential Verified</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Credential ID</Label>
                        <p className="font-mono text-sm">{verifiedCredential.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Type</Label>
                        <p>{verifiedCredential.credentialType}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Institution</Label>
                        <p>{verifiedCredential.institutionName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Candidate</Label>
                        <p className="font-mono text-sm">{truncateAddress(verifiedCredential.candidate)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Issuer</Label>
                        <p className="font-mono text-sm">{truncateAddress(verifiedCredential.issuer)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Issue Date</Label>
                        <p>{new Date(verifiedCredential.timestamp * 1000).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {verifiedCredential.data && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <Label className="text-sm font-medium text-gray-600">Credential Details</Label>
                        <div className="mt-2 space-y-1">
                          <p><strong>Degree:</strong> {verifiedCredential.data.degree}</p>
                          <p><strong>Completion Date:</strong> {verifiedCredential.data.completionDate}</p>
                          {verifiedCredential.data.grade && (
                            <p><strong>Grade:</strong> {verifiedCredential.data.grade}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Badge variant="success" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                      <Badge variant="outline">
                        <Shield className="h-3 w-3 mr-1" />
                        Blockchain Secured
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}



        </>
      )}

      {/* Information Cards */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Immutable Records</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              All credentials are stored on the blockchain, ensuring they cannot be altered or falsified.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Instant Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Verify any credential instantly by checking its status on the blockchain network.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span>Decentralized Storage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Credential files are stored on IPFS, ensuring permanent accessibility and redundancy.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlockchainPage;