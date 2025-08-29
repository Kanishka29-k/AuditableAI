import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { NOTIFICATION_TYPES } from '../utils/constants';

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const { message, type } = notification;

  const getIcon = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircle className="h-5 w-5" />;
      case NOTIFICATION_TYPES.ERROR:
        return <AlertCircle className="h-5 w-5" />;
      case NOTIFICATION_TYPES.WARNING:
        return <AlertTriangle className="h-5 w-5" />;
      case NOTIFICATION_TYPES.INFO:
        return <Info className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'bg-green-500 text-white border-green-600';
      case NOTIFICATION_TYPES.ERROR:
        return 'bg-red-500 text-white border-red-600';
      case NOTIFICATION_TYPES.WARNING:
        return 'bg-yellow-500 text-white border-yellow-600';
      case NOTIFICATION_TYPES.INFO:
        return 'bg-blue-500 text-white border-blue-600';
      default:
        return 'bg-green-500 text-white border-green-600';
    }
  };

  return (
    <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 max-w-md animate-slide-up ${getStyles()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <span className="font-medium">{message}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 hover:opacity-80 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification; 