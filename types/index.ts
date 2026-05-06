export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  fromTime: string;
  toTime: string;
  basePrice: number;
  maxCapacity: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
}

export interface PricingRule {
  id: number;
  name: string;
  description: string;
  discountPercentage: number;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalSetting {
  key: string;
  value: string;
  description: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: number;
  eventId: number;
  userId: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';
  registrationDate: string;
  event?: Event;
}

export interface CreateEventDto {
  title: string;
  description: string;
  location: string;
  date: string;
  fromTime: string;
  toTime: string;
  price: number;
  capacity: number;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

export interface CreatePricingRuleDto {
  name: string;
  description: string;
  discountPercentage: number;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  priority: number;
}

export interface UpdatePricingRuleDto extends Partial<CreatePricingRuleDto> {}

export interface PriceCalculation {
  basePrice: number;
  finalPrice: number;
  breakdown: {
    ruleName: string;
    discountPercentage: number;
    discountAmount: number;
  }[];
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface UserFilters {
  role?: 'ADMIN' | 'USER';
  search?: string;
}

export interface EventFilters {
  search?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
