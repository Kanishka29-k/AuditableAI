import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  Star, 
  Award, 
  TrendingUp, 
  Users,
  Briefcase,
  FileText,
  ChevronRight,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { SAMPLE_JOBS } from '../utils/constants';

const MatchingPage = ({ candidates, showNotification }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [topK, setTopK] = useState(5);
  const [results, setResults] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const { loading, rankCandidates } = useApi();

  const handleJobMatch = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      showNotification('Please enter both job title and description', 'error');
      return;
    }

    if (candidates.length === 0) {
      showNotification('No candidates found. Please upload resumes first.', 'error');
      return;
    }

    try {
      const data = await rankCandidates(jobTitle, jobDescription, topK);
      setResults(data);
      showNotification(`Found ${data.top_candidates.length} matching candidates!`);
    } catch (error) {
      showNotification('Error matching candidates. Please try again.', 'error');
    }
  };

  const loadSampleJob = (job) => {
    setJobTitle(job.title);
    setJobDescription(job.description);
    setSelectedSample(job);
  };

  const clearForm = () => {
    setJobTitle('');
    setJobDescription('');
    setSelectedSample(null);
    setResults(null);
  };

  const getMatchGrade = (score) => {
    if (score >= 0.8) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 0.7) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 0.6) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 0.5) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 0.4) return { grade: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 0.3) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Target className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Job Matching</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Find the perfect candidates for your job requirements using advanced AI-powered semantic matching. 
          Get detailed scores and insights to make informed hiring decisions.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Job Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Job Requirements
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  id="job-title"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Full Stack Developer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description & Requirements *
                </label>
                <textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Describe the role, required skills, experience level, qualifications, and any specific requirements..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="mt-2 text-xs text-gray-500">
                  {jobDescription.length}/2000 characters
                </div>
              </div>

              <div>
                <label htmlFor="top-k" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Top Matches
                </label>
                <select
                  id="top-k"
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={3}>Top 3 Candidates</option>
                  <option value={5}>Top 5 Candidates</option>
                  <option value={10}>Top 10 Candidates</option>
                  <option value={20}>Top 20 Candidates</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleJobMatch}
                  disabled={loading || candidates.length === 0}
                  className="flex-1 btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Clock className="animate-spin h-4 w-4 mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Find Best Matches
                    </>
                  )}
                </button>
                <button
                  onClick={clearForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  title="Clear Form"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Candidate Count Warning */}
            {candidates.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">No Candidates Available</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Upload candidate resumes first to enable job matching.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sample Jobs */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Try Sample Jobs
            </h3>
            <div className="space-y-2">
              {SAMPLE_JOBS.map((job, index) => (
                <button
                  key={index}
                  onClick={() => loadSampleJob(job)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedSample?.title === job.title
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{job.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {job.description.substring(0, 100)}...
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {results ? (
            <div className="space-y-6">
              {/* Results Header */}
              <div className="card overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">
                    Matching Results for "{results.job_title}"
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {results.total_candidates_evaluated} candidates evaluated
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {results.top_matches_returned} top matches
                    </span>
                    <span className="flex items-center">
                      <Zap className="h-4 w-4 mr-1" />
                      Analysis completed in seconds
                    </span>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {(results.summary.best_match_score * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">Best Match Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {(results.summary.average_score * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {results.summary.candidates_above_threshold}
                      </div>
                      <div className="text-sm text-gray-600">Strong Matches (50%+)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidate Rankings */}
              <div className="space-y-4">
                {results.top_candidates.map((candidate, index) => {
                  const matchGrade = getMatchGrade(candidate.overall_score);
                  
                  return (
                    <div key={candidate.candidate_id} className="card p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        {/* Candidate Info */}
                        <div className="flex items-start space-x-4">
                          {/* Rank */}
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                              index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {getRankIcon(index)}
                            </div>
                          </div>
                          
                          {/* Details */}
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {candidate.candidate_name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">{candidate.candidate_info.email}</p>
                            <div className="flex items-center space-x-3">
                              <span className="text-xs text-gray-500">
                                {candidate.candidate_info.total_skills} skills identified
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Overall Score */}
                        <div className="text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold mb-2 ${matchGrade.bg} ${matchGrade.color}`}>
                            {matchGrade.grade}
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {(candidate.overall_score * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-600">Match Score</div>
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {(candidate.score_breakdown.skill_match * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-green-800">Skills Match</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {(candidate.score_breakdown.semantic_similarity * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-purple-800">Semantic Fit</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">
                            {(candidate.score_breakdown.experience_match * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-orange-800">Experience</div>
                        </div>
                      </div>

                      {/* Skills Analysis */}
                      <div className="space-y-3">
                        {/* Matched Skills */}
                        {candidate.matched_skills.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              Matched Skills ({candidate.matched_skills.length})
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {candidate.matched_skills.slice(0, 8).map((skill, skillIndex) => (
                                <span key={skillIndex} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                  {skill}
                                </span>
                              ))}
                              {candidate.matched_skills.length > 8 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{candidate.matched_skills.length - 8} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Missing Skills */}
                        {candidate.missing_skills.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                              <XCircle className="h-4 w-4 text-red-500 mr-1" />
                              Skills Gap ({candidate.missing_skills.length})
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {candidate.missing_skills.slice(0, 5).map((skill, skillIndex) => (
                                <span key={skillIndex} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                  {skill}
                                </span>
                              ))}
                              {candidate.missing_skills.length > 5 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{candidate.missing_skills.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                        <button className="btn-secondary text-sm">
                          View Profile
                        </button>
                        <button className="btn-primary text-sm">
                          Contact Candidate
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Find Perfect Matches</h3>
              <p className="text-gray-600 mb-6">
                Enter your job requirements and let our AI analyze candidate profiles to find the best fits for your position.
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  Skills Matching
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Experience Analysis
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  AI-Powered Ranking
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchingPage;