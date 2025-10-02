const getCorsProxyUrl = () => {
  return import.meta.env.VITE_CORS_PROXY_URL
      || (typeof window !== 'undefined' && window.ENV?.VITE_CORS_PROXY_URL)
      || 'https://cors-anywhere.herokuapp.com/';
};

const CORS_PROXY = getCorsProxyUrl();

export const proxyFetch = async (url, options = {}) => {
  const useProxy = import.meta.env.VITE_USE_CORS_PROXY === 'true'
      || (typeof window !== 'undefined' && window.ENV?.VITE_USE_CORS_PROXY === 'true');

  if (useProxy) {
    console.log(`Using CORS proxy for: ${url}`);
    return fetch(`${CORS_PROXY}${url}`, options);
  }

  return fetch(url, options);
};
