import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { eventService } from '@/services/events/event.service';
import { Event, EventFilters } from '@/types';

interface EventsState {
  items: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  error: string | null;
  filters: EventFilters;
}

const initialState: EventsState = {
  items: [],
  selectedEvent: null,
  loading: false,
  error: null,
  filters: {},
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (filters: EventFilters | undefined, { rejectWithValue }) => {
    try {
      const events = await eventService.getEvents(filters);
      return events;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id: number, { rejectWithValue }) => {
    try {
      const event = await eventService.getEventById(id);
      return event;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (data: Partial<Event>, { rejectWithValue }) => {
    try {
      const event = await eventService.createEvent(data as any);
      return event;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, data }: { id: number; data: Partial<Event> }, { rejectWithValue }) => {
    try {
      const event = await eventService.updateEvent(id, data as any);
      return event;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: number, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<EventFilters>) => {
      state.filters = action.payload;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEventById.fulfilled, (state, action: PayloadAction<Event>) => {
        state.selectedEvent = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.items.unshift(action.payload);
        state.selectedEvent = action.payload;
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        const index = state.items.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.selectedEvent = action.payload;
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((e) => e.id !== action.payload);
        if (state.selectedEvent?.id === action.payload) {
          state.selectedEvent = null;
        }
      });
  },
});

export const { setFilters, clearSelectedEvent, clearError } = eventsSlice.actions;
export default eventsSlice.reducer;
