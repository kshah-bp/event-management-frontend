import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { settingsService } from '@/services/settings/settings.service';
import { GlobalSetting } from '@/types';

interface SettingsState {
  items: GlobalSetting[];
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const settings = await settingsService.getAllSettings();
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSetting = createAsyncThunk(
  'settings/updateSetting',
  async ({ key, value, description }: { key: string; value: string; description?: string }, { rejectWithValue }) => {
    try {
      const setting = await settingsService.setSetting(key, value, description);
      return setting;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<GlobalSetting[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSetting.fulfilled, (state, action: PayloadAction<GlobalSetting>) => {
        const index = state.items.findIndex((s) => s.key === action.payload.key);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const { clearError } = settingsSlice.actions;
export default settingsSlice.reducer;
