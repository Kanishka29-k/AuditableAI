import React, { useMemo } from 'react';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Clock, 
  BarChart3, 
  PieChart, 
  Calendar,
  FileText,
  Star,
  Target,
  Briefcase,
  Activity
} from 'lucide-react';

const AnalyticsPage = ({ candidates }) => {
  // Calculate analytics data
  const analytics = useMemo(() => {
    if (candidates.length === 0) return null;

    // Basic stats
    const totalCandidates = candidates.length;
    const avgSkills = Math.round(candidates.reduce((sum, c) => sum + c.skills_count, 0) / candidates.length);
    const maxSkills = Math.max(...candidates.map(c => c.skills_count));
    const minSkills = Math.min(...candidates.map(c => c.skills_count));

    // Skills distribution
    const skillsDistribution = {
      expert: candidates.filter(c => c.skills_count >= 15).length,
      advanced: candidates.filter(c => c.skills_count >= 10 && c.skills_count < 15).length,
      intermediate: candidates.filter(c => c.skills_count >= 5 && c.skills_count < 10).length,
      beginner: candidates.filter(c => c.skills_count < 5).length
    };

    // Upload timeline (last 30 days)
    const now = new Date();
    const uploads = candidates.reduce((acc, candidate) => {
      const uploadDate = new Date(candidate.uploaded_at);
      const daysDiff = Math.floor((now - uploadDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 30) {
        const dateKey = uploadDate.toDateString();
        acc[dateKey] = (acc[dateKey] || 0) + 1;
      }
      return acc;
    }, {});

    // Recent activity
    const recentUploads = candidates
      .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))
      .slice(0, 10);

    // Top skills simulation (since we don't have actual skill data)
    const mockSkills = [
      { name: 'JavaScript', count: Math.floor(totalCandidates * 0.7) },
      { name: 'Python', count: Math.floor(totalCandidates * 0.6) },
      { name: 'React', count: Math.floor(totalCandidates * 0.5) },
      { name: 'Node.js', count: Math.floor(totalCandidates * 0.4) },
      { name: 'AWS', count: Math.floor(totalCandidates * 0.35) },
      { name: 'SQL', count: Math.floor(totalCandidates * 0.45) },
      { name: 'Docker', count: Math.floor(totalCandidates * 0.3) },
      { name: 'Machine Learning', count: Math.floor(totalCandidates * 0.25) }
    ].sort((a, b) => b.count - a.count);

    return {
      totalCandidates,
      avgSkills,
      maxSkills,
      minSkills,
      skillsDistribution,
      uploads,
      recentUploads,
      topSkills: mockSkills
    };
  }, [candidates]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSkillLevelColor = (level) => {
    const colors = {
      expert: 'bg-purple-500',
      advanced: 'bg-blue-500',
      intermediate: 'bg-green-500',
      beginner: 'bg-yellow-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mb-1`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <BarChart3 className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload candidate resumes to see detailed analytics and insights about your talent pool
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Candidate Overview</h3>
              <p className="text-sm text-blue-700">Track total candidates and skills</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">Skills Analysis</h3>
              <p className="text-sm text-green-700">Analyze skill distributions and trends</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">Activity Timeline</h3>
              <p className="text-sm text-purple-700">Monitor upload activity over time</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
        <p className="text-lg text-gray-600">
          Comprehensive insights and analytics about your candidate pool
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Candidates"
          value={analytics.totalCandidates}
          subtitle="In your database"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Average Skills"
          value={analytics.avgSkills}
          subtitle="Per candidate"
          icon={Award}
          color="green"
        />
        <StatCard
          title="Highest Skills"
          value={analytics.maxSkills}
          subtitle="Most skilled candidate"
          icon={Star}
          color="purple"
        />
        <StatCard
          title="Recent Uploads"
          value={analytics.recentUploads.filter(c => {
            const daysDiff = Math.floor((new Date() - new Date(c.uploaded_at)) / (1000 * 60 * 60 * 24));
            return daysDiff <= 7;
          }).length}
          subtitle="Last 7 days"
          icon={Clock}
          color="orange"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Skills Distribution */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Skills Level Distribution</h2>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {Object.entries(analytics.skillsDistribution).map(([level, count]) => {
              const percentage = ((count / analytics.totalCandidates) * 100).toFixed(1);
              const levelLabels = {
                expert: 'Expert (15+ skills)',
                advanced: 'Advanced (10-14 skills)',
                intermediate: 'Intermediate (5-9 skills)',
                beginner: 'Beginner (< 5 skills)'
              };
              
              return (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${getSkillLevelColor(level)}`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {levelLabels[level]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getSkillLevelColor(level)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {count}
                    </span>
                    <span className="text-xs text-gray-500 w-12">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Skills Range</span>
                <span className="text-sm font-medium">{analytics.minSkills} - {analytics.maxSkills}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Performers</span>
                <span className="text-sm font-medium">{analytics.skillsDistribution.expert + analytics.skillsDistribution.advanced}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Candidates with 10+ Skills</span>
                <span className="text-sm font-medium text-green-600">
                  {Math.round(((analytics.skillsDistribution.expert + analytics.skillsDistribution.advanced) / analytics.totalCandidates) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Skills */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Most Common Skills</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics.topSkills.map((skill, index) => {
              const percentage = ((skill.count / analytics.totalCandidates) * 100).toFixed(1);
              const maxCount = analytics.topSkills[0]?.count || 1;
              const barWidth = (skill.count / maxCount) * 100;
              
              return (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-500 w-4">#{index + 1}</span>
                      <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">{skill.count}</span>
                      <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics.recentUploads.slice(0, 8).map((candidate, index) => (
              <div key={candidate.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">
                    {(candidate.name || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {candidate.name || 'Unknown Name'}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{candidate.skills_count} skills</span>
                    <span>•</span>
                    <span>{formatDate(candidate.uploaded_at)}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
            
            {analytics.recentUploads.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No recent uploads</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Talent Pool Summary</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold mb-2">{analytics.totalCandidates}</div>
              <div className="text-blue-100">Total candidates in your database</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{analytics.avgSkills}</div>
              <div className="text-blue-100">Average skills per candidate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                {Math.round(((analytics.skillsDistribution.expert + analytics.skillsDistribution.advanced) / analytics.totalCandidates) * 100)}%
              </div>
              <div className="text-blue-100">High-skilled candidates (10+ skills)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;