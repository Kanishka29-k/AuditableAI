const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint);
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Resume-specific endpoints
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.post('/upload-resume', formData);
  }

  async parseResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.post('/parse-resume', formData);
  }

  async getCandidates() {
    return this.get('/candidates');
  }

  async deleteCandidate(candidateId) {
    return this.delete(`/candidates/${candidateId}`);
  }

  async clearAllCandidates() {
    return this.delete('/candidates');
  }

  async matchJob(jobTitle, jobDescription, candidateId = null) {
    const formData = new FormData();
    formData.append('job_title', jobTitle);
    formData.append('job_description', jobDescription);
    if (candidateId !== null) {
      formData.append('candidate_id', candidateId);
    }
    return this.post('/match-job', formData);
  }

  async rankCandidates(jobTitle, jobDescription, topK = 10) {
    const formData = new FormData();
    formData.append('job_title', jobTitle);
    formData.append('job_description', jobDescription);
    formData.append('top_k', topK.toString());
    return this.post('/rank-candidates', formData);
  }

  async getHealth() {
    return this.get('/health');
  }
}

export const api = new ApiService(API_BASE_URL);
export default api;