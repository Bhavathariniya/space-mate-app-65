interface Window {
  ENV?: {
    VITE_GOOGLE_SHEETS_API_KEY: string;
    VITE_GOOGLE_SHEETS_SPREADSHEET_ID: string;
    VITE_USE_CORS_PROXY: string;
    VITE_CORS_PROXY_URL: string;
    [key: string]: string;
  };
}

export {}; 