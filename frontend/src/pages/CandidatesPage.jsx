import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Users, 
  Eye, 
  Trash2, 
  Award, 
  Clock, 
  Mail, 
  Phone,
  FileText,
  Filter,
  SortAsc,
  SortDesc,
  User,
  Calendar,
  Download
} from 'lucide-react';
import { useApi } from '../hooks/useApi';

const CandidatesPage = ({ candidates, onCandidateDelete, showNotification, loading }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterBy, setFilterBy] = useState('all');
  const { deleteCandidate } = useApi();

  // Filter and sort candidates
  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.email.toLowerCase().includes(searchLower) ||
        candidate.filename.toLowerCase().includes(searchLower);

      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'high-skills') return matchesSearch && candidate.skills_count >= 10;
      if (filterBy === 'recent') {
        const uploadDate = new Date(candidate.uploaded_at);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return matchesSearch && uploadDate > weekAgo;
      }
      
      return matchesSearch;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'skills':
          aValue = a.skills_count;
          bValue = b.skills_count;
          break;
        case 'date':
          aValue = new Date(a.uploaded_at);
          bValue = new Date(b.uploaded_at);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [candidates, searchTerm, sortBy, sortOrder, filterBy]);

  const handleDeleteCandidate = async (candidateId, candidateName) => {
    if (!window.confirm(`Are you sure you want to delete ${candidateName}?`)) {
      return;
    }

    try {
      await deleteCandidate(candidateId);
      onCandidateDelete();
      showNotification(`Candidate ${candidateName} deleted successfully`);
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate(null);
      }
    } catch (error) {
      showNotification('Failed to delete candidate', 'error');
    }
  };

  const getSkillLevel = (skillCount) => {
    if (skillCount >= 15) return { label: 'Expert', color: 'bg-purple-100 text-purple-800' };
    if (skillCount >= 10) return { label: 'Advanced', color: 'bg-blue-100 text-blue-800' };
    if (skillCount >= 5) return { label: 'Intermediate', color: 'bg-green-100 text-green-800' };
    return { label: 'Beginner', color: 'bg-yellow-100 text-yellow-800' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Manage Candidates</h1>
        <p className="text-lg text-gray-600">
          View, search, and manage all uploaded candidate profiles
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Candidates</option>
              <option value="high-skills">High Skills (10+)</option>
              <option value="recent">Recent (7 days)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="skills">Sort by Skills</option>
              <option value="date">Sort by Date</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {candidates.length} Total
            </div>
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              {filteredAndSortedCandidates.length} Showing
            </div>
            {candidates.length > 0 && (
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                {Math.round(candidates.reduce((sum, c) => sum + c.skills_count, 0) / candidates.length)} Avg Skills
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredAndSortedCandidates.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {candidates.length === 0 ? 'No Candidates Found' : 'No Results Found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {candidates.length === 0 
              ? 'Upload some resumes to get started with candidate management'
              : 'Try adjusting your search terms or filters'
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="btn-secondary"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Candidates List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredAndSortedCandidates.map((candidate) => {
              const skillLevel = getSkillLevel(candidate.skills_count);
              const isSelected = selectedCandidate?.id === candidate.id;
              
              return (
                <div
                  key={candidate.id}
                  className={`card p-6 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-white">
                          {(candidate.name || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {candidate.name || 'Unknown Name'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{candidate.email}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${skillLevel.color}`}>
                            <Award className="h-3 w-3 mr-1" />
                            {candidate.skills_count} Skills • {skillLevel.label}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(candidate.uploaded_at)}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-500 truncate">
                          <FileText className="h-3 w-3 inline mr-1" />
                          {candidate.filename}
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCandidate(candidate);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCandidate(candidate.id, candidate.name);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Candidate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Candidate Details Panel */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {selectedCandidate ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">
                        {(selectedCandidate.name || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {selectedCandidate.name || 'Unknown Name'}
                    </h3>
                    <p className="text-gray-600">{selectedCandidate.email}</p>
                  </div>

                  {/* Skills Overview */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Skills Overview</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-1">
                            {selectedCandidate.skills_count}
                          </div>
                          <div className="text-sm text-gray-600">Technical Skills</div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevel(selectedCandidate.skills_count).color}`}>
                          {getSkillLevel(selectedCandidate.skills_count).label} Level
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="text-sm">{selectedCandidate.email || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="text-sm">Not available</span>
                      </div>
                    </div>
                  </div>

                  {/* File Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">File Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <FileText className="h-4 w-4 mr-3 text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{selectedCandidate.filename}</div>
                          <div className="text-xs text-gray-500">Original filename</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 mr-3 text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(selectedCandidate.uploaded_at)}
                          </div>
                          <div className="text-xs text-gray-500">Upload date</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {selectedCandidate.skills_count}
                        </div>
                        <div className="text-xs text-blue-800">Skills Found</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-600">
                          {Math.floor((Date.now() - new Date(selectedCandidate.uploaded_at)) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="text-xs text-green-800">Days Ago</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-gray-200 space-y-3">
                    <button className="w-full btn-primary">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Profile
                    </button>
                    <button className="w-full btn-secondary">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </button>
                    <button
                      onClick={() => handleDeleteCandidate(selectedCandidate.id, selectedCandidate.name)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Candidate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Candidate</h3>
                  <p className="text-gray-600 text-sm">
                    Click on any candidate from the list to view their detailed information and manage their profile.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {filteredAndSortedCandidates.length > 0 && (
        <div className="mt-8 card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bulk Actions</h3>
              <p className="text-sm text-gray-600">Perform actions on multiple candidates</p>
            </div>
            <div className="flex space-x-3">
              <button className="btn-secondary">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all candidates? This action cannot be undone.')) {
                    // Implementation for clearing all candidates would go here
                    showNotification('Bulk delete functionality coming soon', 'info');
                  }
                }}
                className="flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesPage;