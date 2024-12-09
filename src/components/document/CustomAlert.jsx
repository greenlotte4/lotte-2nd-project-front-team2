import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';

const AlertTypes = {
  success: {
    icon: CheckCircle2,
    color: 'text-green-500',
    borderColor: 'border-green-500/30'
  },
  error: {
    icon: XCircle,
    color: 'text-red-500',
    borderColor: 'border-red-500/30'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    borderColor: 'border-yellow-500/30'
  },
  info: {
    icon: Info,
    color: 'text-blue-500',
    borderColor: 'border-blue-500/30'
  }
};

const CustomAlert = ({ 
  type = 'info', 
  title, 
  message,
  subMessage, 
  onConfirm, 
  onCancel, 
  confirmText = '확인', 
  cancelText = '취소',
  showCancel = false
}) => {
  const { icon: Icon, color, borderColor } = AlertTypes[type] || AlertTypes.info;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`w-[90%] max-w-md bg-white/95 rounded-2xl shadow-xl overflow-hidden border ${borderColor}`}
      >
        <div className="flex flex-col items-center px-4 pt-6 pb-4 text-center">
          <Icon className={`w-16 h-16 ${color} mb-4`} />
          <h2 className="text-xl font-semibold text-black mb-2">
            {title}
          </h2>
          <span className="text-gray-600 px-4 mb-4 text-base">{subMessage || ""}</span>
          <p className="text-gray-600 px-4 mb-4 text-base">
            {message}
          </p>
        </div>
        
        <div className="flex border-t border-gray-200">
          {showCancel && (
            <button 
              onClick={onCancel}
              className="w-1/2 py-3 text-[#007AFF] border-r border-gray-200 
                         active:bg-gray-100 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button 
            onClick={onConfirm}
            className={`${showCancel ? 'w-1/2' : 'w-full'} py-3 text-[#007AFF] font-semibold 
                       active:bg-gray-100 transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomAlert;