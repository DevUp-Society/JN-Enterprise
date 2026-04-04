import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};

    if (status === 401) {
      // CLEAR_SESSION_PROTOCOL
      window.location.href = '/login';
    } else if (status === 409) {
      // CONFLICT_RESOLUTION_PROTOCOL
      const event = new CustomEvent('CONFLICT_ERROR', { 
        detail: { message: 'Data collision detected. System auto-resolved the record. Please refresh to see the latest stock.' } 
      });
      window.dispatchEvent(event);
    } else if (status === 500 || status === 400) {
      // TRIGGER_INDUSTRIAL_ALERT_PROTOCOL
      const message = error.response?.data?.message || 'CRITICAL_SYSTEM_SYNCHRONIZATION_ERROR';
      const event = new CustomEvent('INDUSTRIAL_ERROR', { detail: { message } });
      window.dispatchEvent(event);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;










