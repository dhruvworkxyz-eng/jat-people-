const LOCAL_API_BASE_URL = 'http://localhost:5000';
const SAME_ORIGIN_API_BASE_URL = '';

const isLocalApiUrl = (url: string) => url.includes('localhost') || url.includes('127.0.0.1');

export const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredUrl && (import.meta.env.DEV || !isLocalApiUrl(configuredUrl))) {
    return configuredUrl.replace(/\/$/, '');
  }

  if (import.meta.env.DEV) {
    return LOCAL_API_BASE_URL;
  }

  return SAME_ORIGIN_API_BASE_URL;
};

export const getApiUrl = (path: string) => `${getApiBaseUrl()}${path}`;
