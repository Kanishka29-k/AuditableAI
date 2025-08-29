import { useState, useEffect, useCallback } from 'react';
import blockchainService from '../services/blockchainService';

export const useBlockchain = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if already connected on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      if (blockchainService.isConnected()) {
        setIsConnected(true);
        setAccount(blockchainService.getCurrentAccount());
        const networkInfo = await blockchainService.getCurrentNetwork();
        setNetwork(networkInfo);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await blockchainService.connectWallet();
      
      setIsConnected(true);
      setAccount(result.account);
      setNetwork(result.network);

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    blockchainService.disconnect();
    setIsConnected(false);
    setAccount(null);
    setNetwork(null);
    setError(null);
  }, []);

  const switchNetwork = useCallback(async (networkKey) => {
    try {
      setLoading(true);
      setError(null);

      await blockchainService.switchNetwork(networkKey);
      const networkInfo = await blockchainService.getCurrentNetwork();
      setNetwork(networkInfo);

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const issueCredential = useCallback(async (credentialData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await blockchainService.issueCredential(credentialData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerResume = useCallback(async (resumeData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await blockchainService.registerResume(resumeData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyCredential = useCallback(async (credentialId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await blockchainService.verifyCredential(credentialId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCandidateResumes = useCallback(async (candidateAddress) => {
    try {
      setLoading(true);
      setError(null);

      const resumes = await blockchainService.getCandidateResumes(candidateAddress);
      return resumes;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const grantResumeAccess = useCallback(async (resumeId, recruiterAddress) => {
    try {
      setLoading(true);
      setError(null);

      const result = await blockchainService.grantResumeAccess(resumeId, recruiterAddress);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    isConnected,
    account,
    network,
    loading,
    error,

    // Actions
    connectWallet,
    disconnect,
    switchNetwork,
    issueCredential,
    registerResume,
    verifyCredential,
    getCandidateResumes,
    grantResumeAccess,

    // Utils
    isMetaMaskInstalled: blockchainService.isMetaMaskInstalled(),
  };
};