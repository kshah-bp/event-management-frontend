import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { pricingService } from '@/services/pricing/pricing.service';
import { PricingRule } from '@/types';

interface PricingState {
  items: PricingRule[];
  loading: boolean;
  error: string | null;
}

const initialState: PricingState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchPricingRules = createAsyncThunk(
  'pricing/fetchPricingRules',
  async (_, { rejectWithValue }) => {
    try {
      const rules = await pricingService.getPricingRules();
      return rules;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPricingRule = createAsyncThunk(
  'pricing/createPricingRule',
  async (data: Partial<PricingRule>, { rejectWithValue }) => {
    try {
      const rule = await pricingService.createPricingRule(data as any);
      return rule;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePricingRule = createAsyncThunk(
  'pricing/updatePricingRule',
  async ({ id, data }: { id: number; data: Partial<PricingRule> }, { rejectWithValue }) => {
    try {
      const rule = await pricingService.updatePricingRule(id, data as any);
      return rule;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePricingRule = createAsyncThunk(
  'pricing/deletePricingRule',
  async (id: number, { rejectWithValue }) => {
    try {
      await pricingService.deletePricingRule(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const togglePricingRule = createAsyncThunk(
  'pricing/togglePricingRule',
  async ({ id, active }: { id: number; active: boolean }, { rejectWithValue }) => {
    try {
      const rule = await pricingService.togglePricingRule(id, active);
      return rule;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const pricingSlice = createSlice({
  name: 'pricing',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPricingRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPricingRules.fulfilled, (state, action: PayloadAction<PricingRule[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchPricingRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPricingRule.fulfilled, (state, action: PayloadAction<PricingRule>) => {
        state.items.push(action.payload);
      })
      .addCase(updatePricingRule.fulfilled, (state, action: PayloadAction<PricingRule>) => {
        const index = state.items.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deletePricingRule.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      })
      .addCase(togglePricingRule.fulfilled, (state, action: PayloadAction<PricingRule>) => {
        const index = state.items.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export const { clearError } = pricingSlice.actions;
export default pricingSlice.reducer;
