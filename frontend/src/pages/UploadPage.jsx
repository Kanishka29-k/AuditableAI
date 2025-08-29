import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  X,
  Plus
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE } from '../utils/constants';

const UploadPage = ({ onUploadSuccess, showNotification }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const { loading, uploadResume } = useApi();

  const validateFile = (file) => {
    // Check file type
    const isValidType = Object.values(SUPPORTED_FILE_TYPES).includes(file.type) || 
                       file.name.toLowerCase().endsWith('.docx') ||
                       file.name.toLowerCase().endsWith('.pdf') ||
                       file.name.toLowerCase().endsWith('.txt');
    
    if (!isValidType) {
      return 'Unsupported file type. Please upload PDF, DOCX, or TXT files.';
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
    }

    return null;
  };

  const handleFileSelect = (files) => {
    const newFiles = Array.from(files);
    const validFiles = [];
    const errors = [];

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        // Check for duplicates
        const duplicate = selectedFiles.find(f => f.name === file.name && f.size === file.size);
        if (!duplicate) {
          validFiles.push({
            file,
            id: Date.now() + Math.random(),
            status: 'pending'
          });
        } else {
          errors.push(`${file.name}: File already selected`);
        }
      }
    });

    if (errors.length > 0) {
      showNotification(`Some files were skipped: ${errors.join(', ')}`, 'error');
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    let successCount = 0;
    const totalFiles = selectedFiles.length;

    for (const fileData of selectedFiles) {
      const { file, id } = fileData;
      
      try {
        setUploadProgress(prev => ({ ...prev, [id]: 'uploading' }));
        
        await uploadResume(file);
        
        setUploadProgress(prev => ({ ...prev, [id]: 'success' }));
        successCount++;
        
        // Update file status
        setSelectedFiles(prev => 
          prev.map(f => f.id === id ? { ...f, status: 'success' } : f)
        );
      } catch (error) {
        setUploadProgress(prev => ({ ...prev, [id]: 'error' }));
        setSelectedFiles(prev => 
          prev.map(f => f.id === id ? { ...f, status: 'error', error: error.message } : f)
        );
      }
    }

    if (successCount > 0) {
      onUploadSuccess();
      showNotification(`${successCount}/${totalFiles} resume(s) uploaded successfully!`);
      
      // Clear successful uploads after delay
      setTimeout(() => {
        setSelectedFiles(prev => prev.filter(f => f.status !== 'success'));
        setUploadProgress({});
      }, 2000);
    } else {
      showNotification('Failed to upload resumes', 'error');
    }
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setUploadProgress({});
  };

  const getStatusIcon = (status, id) => {
    const progressStatus = uploadProgress[id];
    
    if (progressStatus === 'uploading' || status === 'uploading') {
      return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
    }
    if (progressStatus === 'success' || status === 'success') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (progressStatus === 'error' || status === 'error') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return <FileText className="h-4 w-4 text-blue-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Upload className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Candidate Resumes</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload resumes in PDF, DOCX, or TXT format to get started with AI-powered screening. 
          Our system will automatically extract skills, experience, and key information.
        </p>
      </div>

      {/* Upload Area */}
      <div className="card overflow-hidden mb-8">
        <div
          className={`border-2 border-dashed transition-all duration-300 p-12 text-center ${
            dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFileSelect(e.dataTransfer.files);
          }}
        >
          <div className="space-y-4">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-colors ${
              dragOver ? 'bg-blue-500' : 'bg-gray-400'
            }`}>
              <Upload className={`h-10 w-10 ${dragOver ? 'text-white' : 'text-white'}`} />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {dragOver ? 'Drop files here' : 'Drag & drop resume files'}
              </h3>
              <p className="text-gray-600 mb-4">
                or click to browse your computer
              </p>
            </div>
            
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="btn-primary inline-flex items-center cursor-pointer transform hover:scale-105 transition-transform"
            >
              <Plus className="mr-2 h-5 w-5" />
              Select Files
            </label>
          </div>
        </div>

        {/* File Format Info */}
        <div className="bg-blue-50 border-t border-blue-100 p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">Supported Formats</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-center text-blue-800">
              <FileText className="h-5 w-5 mr-2 text-red-500" />
              <span className="font-medium">PDF Documents</span>
            </div>
            <div className="flex items-center text-blue-800">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              <span className="font-medium">Word Documents (.docx)</span>
            </div>
            <div className="flex items-center text-blue-800">
              <FileText className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-medium">Text Files (.txt)</span>
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB per file
          </p>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="card overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Selected Files ({selectedFiles.length})
            </h3>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
              disabled={loading}
            >
              Clear All
            </button>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
            {selectedFiles.map((fileData) => (
              <div key={fileData.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center flex-1">
                  <div className="mr-4">
                    {getStatusIcon(fileData.status, fileData.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileData.file.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{formatFileSize(fileData.file.size)}</span>
                      <span>•</span>
                      <span>{fileData.file.type || 'Unknown type'}</span>
                      {fileData.error && (
                        <>
                          <span>•</span>
                          <span className="text-red-500">{fileData.error}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {fileData.status === 'success' && (
                    <span className="text-xs text-green-600 font-medium">Uploaded</span>
                  )}
                  {fileData.status === 'error' && (
                    <span className="text-xs text-red-600 font-medium">Failed</span>
                  )}
                  
                  <button
                    onClick={() => removeFile(fileData.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    disabled={loading && uploadProgress[fileData.id] === 'uploading'}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                {selectedFiles.filter(f => f.status === 'success').length} uploaded • {' '}
                {selectedFiles.filter(f => f.status === 'error').length} failed • {' '}
                {selectedFiles.filter(f => f.status === 'pending').length} pending
              </div>
            </div>
            
            <button
              onClick={uploadFiles}
              disabled={loading || selectedFiles.length === 0 || selectedFiles.every(f => f.status !== 'pending')}
              className="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Clock className="animate-spin h-5 w-5 mr-2" />
                  Uploading Files...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload {selectedFiles.filter(f => f.status === 'pending').length} File(s)
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">💡 Tips for Best Results</h4>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Ensure resumes are well-formatted with clear sections</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>PDF format typically provides the best text extraction results</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Include skills, experience, and education information clearly</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>Avoid image-based resumes for better AI processing</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UploadPage;