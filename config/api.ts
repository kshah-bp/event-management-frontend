const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

export default API_CONFIG;
