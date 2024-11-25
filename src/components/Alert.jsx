import React from 'react';
import { alertStyles } from '../util/sizeClasses';
    
export const CustomAlert = ({ type, message, onClose ,isOpen}) => {
      if(!isOpen) return null;
      const alertClass = alertStyles[type] || alertStyles.info;

      return (
        <div className={`fixed inset-0 flex justify-center mt-14 items-start z-50`}>
          <div
            className={`${alertClass} border-2 border-solid rounded-lg p-4 max-w-xs w-full`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* Icon based on alert type */}
                {type === 'success' && (
                  <svg
                    className="h-6 w-6 text-green-700"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4.586l-1.707-1.707a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414L11 11.586V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {type === 'error' && (
                  <svg
                    className="h-6 w-6 text-red-700"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 2a2 2 0 00-2-2H4a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V2zM4 0h12a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {type === 'info' && (
                  <svg
                    className="h-6 w-6 text-blue-700"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zM9 7a1 1 0 112 0v4a1 1 0 11-2 0V7zM9 13a1 1 0 112 0v2a1 1 0 11-2 0v-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {type === 'warning' && (
                  <svg
                    className="h-6 w-6 text-yellow-700"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 6a1 1 0 012 0v4a1 1 0 11-2 0V6zm1 8a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {type === 'basic' &&(
                    <svg
                    className="h-6 w-6 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 6a1 1 0 012 0v4a1 1 0 11-2 0V6zm1 8a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-4 flex-1">
                <p className="font-medium">{message}</p>
              </div>
              {type === 'basic' && (
                <button
                onClick={onClose}
                className="ml-4 text-gray-500 hover:text-gray-900 focus:outline-none"
              >
                x
              </button>
              )}
              {type === 'warning' && (
                <button
                onClick={onClose}
                className="ml-4 text-yellow-500 hover:text-yellow-900 focus:outline-none"
              >
                x
              </button>
              )}
              {type === 'success' && (
                <button
                onClick={onClose}
                className="ml-4 text-green-500 hover:text-green-900 focus:outline-none"
              >
                x
              </button>
              )}
              {type === 'info' && (
                <button
                onClick={onClose}
                className="ml-4 text-blue-500 hover:text-blue-900 focus:outline-none"
              >
                x
              </button>
              )}
              {type === 'error' && (
                <button
                onClick={onClose}
                className="ml-4 text-red-500 hover:text-red-900 focus:outline-none"
              >
                x
              </button>
              )}
              
            </div>
          </div>
        </div>
      );
    };
    
    export default CustomAlert;
    