import { useState, useCallback } from 'react';
import { api } from '../utils/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadResume = useCallback((file) => {
    return execute(() => api.uploadResume(file));
  }, [execute]);

  const parseResume = useCallback((file) => {
    return execute(() => api.parseResume(file));
  }, [execute]);

  const getCandidates = useCallback(() => {
    return execute(() => api.getCandidates());
  }, [execute]);

  const deleteCandidate = useCallback((candidateId) => {
    return execute(() => api.deleteCandidate(candidateId));
  }, [execute]);

  const matchJob = useCallback((jobTitle, jobDescription, candidateId = null) => {
    return execute(() => api.matchJob(jobTitle, jobDescription, candidateId));
  }, [execute]);

  const rankCandidates = useCallback((jobTitle, jobDescription, topK = 10) => {
    return execute(() => api.rankCandidates(jobTitle, jobDescription, topK));
  }, [execute]);

  return {
    loading,
    error,
    uploadResume,
    parseResume,
    getCandidates,
    deleteCandidate,
    matchJob,
    rankCandidates,
  };
};