import { createContext, useContext, useState, useCallback } from 'react';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from 'react-icons/fa';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container-custom">
        {toasts.map((toast) => {
          let alertClass = 'alert-info';
          let Icon = FaInfoCircle;

          if (toast.type === 'success') {
            alertClass = 'alert-success';
            Icon = FaCheckCircle;
          } else if (toast.type === 'error' || toast.type === 'danger') {
            alertClass = 'alert-danger';
            Icon = FaExclamationCircle;
          } else if (toast.type === 'warning') {
            alertClass = 'alert-warning';
            Icon = FaExclamationCircle;
          }

          return (
            <div
              key={toast.id}
              className={`alert ${alertClass} toast-alert d-flex align-items-center justify-content-between p-3 mb-0`}
              role="alert"
            >
              <div className="d-flex align-items-center gap-2">
                <Icon className="fs-5 flex-shrink-0" />
                <span className="small fw-medium">{toast.message}</span>
              </div>
              <button
                type="button"
                className="btn-close btn-sm ms-2"
                aria-label="Close"
                onClick={() => removeToast(toast.id)}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
