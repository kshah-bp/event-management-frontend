import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import usersReducer from '@/features/users/usersSlice';
import eventsReducer from '@/features/events/eventsSlice';
import registrationsReducer from '@/features/registrations/registrationsSlice';
import settingsReducer from '@/features/settings/settingsSlice';
import pricingReducer from '@/features/pricing/pricingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
    settings: settingsReducer,
    pricing: pricingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
