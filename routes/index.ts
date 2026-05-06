export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  SIGNUP: '/signup',

  // User routes
  USER_DASHBOARD: '/dashboard',
  USER_EVENTS: '/events',
  USER_EVENTS_DETAIL: (id: number | string) => `/events/${id}`,
  USER_MY_REGISTRATIONS: '/my-registrations',
  USER_PROFILE: '/profile',

  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_PRICING: '/admin/pricing',

  // Helper
  EVENT_DETAIL: (id: number | string) => `/events/${id}`,
  USER_DETAIL: (id: number | string) => `/users/${id}`,
} as const;

export type AppRoute = keyof typeof ROUTES;

export const isAdminRoute = (path: string): boolean => {
  return path.startsWith('/admin');
};

export const isPublicRoute = (path: string): boolean => {
  return [ROUTES.LOGIN, ROUTES.SIGNUP].includes(path as any);
};