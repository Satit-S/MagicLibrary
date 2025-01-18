import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message: string, type: 'success' | 'info') => {
  toast[type](message, {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: false, 
    closeOnClick: true, 
    pauseOnHover: true, 
    theme: "light",
  });
};

const ToastNotification: React.FC = () => {
  return <ToastContainer aria-label="Notification Area" />;
};

export default ToastNotification;
