import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { registrationService } from '@/services/registrations/registration.service';
import { EventRegistration } from '@/types';

interface RegistrationsState {
  items: EventRegistration[];
  loading: boolean;
  error: string | null;
}

const initialState: RegistrationsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMyRegistrations = createAsyncThunk(
  'registrations/fetchMyRegistrations',
  async (_, { rejectWithValue }) => {
    try {
      const registrations = await registrationService.getMyRegistrations();
      return registrations;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const confirmRegistration = createAsyncThunk(
  'registrations/confirmRegistration',
  async (id: number, { rejectWithValue }) => {
    try {
      const registration = await registrationService.confirmRegistration(id);
      return registration;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerForEvent = createAsyncThunk(
  'registrations/registerForEvent',
  async (eventId: number, { rejectWithValue }) => {
    try {
      const registration = await registrationService.registerForEvent(eventId);
      return registration;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRegistrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRegistrations.fulfilled, (state, action: PayloadAction<EventRegistration[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMyRegistrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerForEvent.fulfilled, (state, action: PayloadAction<EventRegistration>) => {
        state.items.push(action.payload);
      })
      .addCase(confirmRegistration.fulfilled, (state, action: PayloadAction<EventRegistration>) => {
        const index = state.items.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const { clearError } = registrationsSlice.actions;
export default registrationsSlice.reducer;
