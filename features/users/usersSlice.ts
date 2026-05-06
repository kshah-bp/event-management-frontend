import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService } from '@/services/users/user.service';
import { User, UserFilters } from '@/types';

interface UsersState {
  items: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  filters: UserFilters;
}

const initialState: UsersState = {
  items: [],
  selectedUser: null,
  loading: false,
  error: null,
  filters: {},
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (filters: UserFilters | undefined, { rejectWithValue }) => {
    try {
      const users = await userService.getUsers(filters);
      return users;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      const user = await userService.getUserById(id);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: number; data: Partial<User> }, { rejectWithValue }) => {
    try {
      const user = await userService.updateUser(id, data);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ id, role }: { id: number; role: 'ADMIN' | 'USER' }, { rejectWithValue }) => {
    try {
      const user = await userService.updateUserRole(id, role);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<UserFilters>) => {
      state.filters = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.selectedUser = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.selectedUser = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.selectedUser = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((u) => u.id !== action.payload);
      });
  },
});

export const { setFilters, clearSelectedUser, clearError } = usersSlice.actions;
export default usersSlice.reducer;
