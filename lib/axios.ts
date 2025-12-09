import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 50000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token') || 'null';
        if (token) {
          config.headers = config.headers || {};
          config.headers['x-auth-token'] = token;
        }
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError | any) => {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        const message = data?.message || 'An error occurred';

        switch (status) {
          case 401:
            console.error('Unauthorized! Please log in again.');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              localStorage.removeItem('userData');
            }
            break;

          case 404:
            console.error('Not Found! The requested resource does not exist.');
            break;

          case 400:
            console.error('Bad Request! Please check your input.');
            break;

          case 403:
            console.error(
              'Forbidden! You do not have permission to access this resource.'
            );
            break;

          case 500:
            console.error(
              'Server Error! Something went wrong on the server.'
            );
            break;

          case 503:
            console.error(
              'Service Unavailable! The server is temporarily unavailable.'
            );
            break;

          default:
            console.error(`Unexpected Error (${status}): ${message}`);
        }
      } else if (error.request) {
        console.error(
          'No response received from the server. Please check your network connection.'
        );
        error.message =
          'No response received from the server. Please check your network connection.';
      } else {
        console.error('Request Error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Default instance – change base URL here if needed
const axiosInstance = createAxiosInstance(
  process.env.NEXT_BACKEND_BASE_URL || 'http://localhost:8000/api/v1'
);

export default axiosInstance; 
export { createAxiosInstance };


