/**
 * Simple CORS proxy helper for development purposes.
 * This can be used to proxy requests to the Google Sheets API
 * when running into CORS issues in development.
 * 
 * For production, consider a proper backend proxy solution.
 */

// Get the CORS proxy URL from environment variables, window.ENV, or use the default
const getCorsProxyUrl = () => {
  if (import.meta.env.VITE_CORS_PROXY_URL) {
    return import.meta.env.VITE_CORS_PROXY_URL;
  }
  
  if (typeof window !== 'undefined' && window.ENV && window.ENV.VITE_CORS_PROXY_URL) {
    return window.ENV.VITE_CORS_PROXY_URL;
  }
  
  return 'https://cors-anywhere.herokuapp.com/';
};

const CORS_PROXY = getCorsProxyUrl();

/**
 * Wraps a fetch call with a CORS proxy
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export const proxyFetch = async (url, options = {}) => {
  // Check if proxy is enabled in env vars or window.ENV
  const useProxyEnv = import.meta.env.VITE_USE_CORS_PROXY === 'true';
  const useProxyWindow = typeof window !== 'undefined' && 
                         window.ENV && 
                         window.ENV.VITE_USE_CORS_PROXY === 'true';
  
  // Use proxy if explicitly enabled in either place
  const useProxy = useProxyEnv || useProxyWindow;
  
  if (useProxy) {
    console.log(`Using CORS proxy for: ${url}`);
    return fetch(`${CORS_PROXY}${url}`, options);
  }
  
  return fetch(url, options);
};



/**
 * Instructions for setting up a proxy server:
 * 
 * 1. For a quick development solution:
 *    - Add VITE_USE_CORS_PROXY=true to your .env file
 *    - Or use your own CORS proxy URL: VITE_CORS_PROXY_URL=https://your-proxy-url.com/
 * 
 * 2. For a local development proxy:
 *    - Run `npm install -g cors-anywhere` in terminal
 *    - Start proxy: `cors-anywhere`
 *    - Add to .env: VITE_CORS_PROXY_URL=http://localhost:8080/
 * 
 * 3. For production:
 *    - Set up a backend proxy on your server
 *    - Route Google Sheets API requests through your backend
 *    
 * 4. Use Google Apps Script:
 *    - Create a Google Apps Script that acts as a proxy between your app and Google Sheets
 *    - Deploy as a web app with CORS enabled
 *    - This approach is often simpler and more secure for production use
 */ 