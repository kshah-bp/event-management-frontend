import { apiClient } from '../api/client';
import { PricingRule, CreatePricingRuleDto, UpdatePricingRuleDto, PriceCalculation } from '@/types';

export class PricingService {
  async getPricingRules(): Promise<PricingRule[]> {
    return apiClient.get<PricingRule[]>('/admin/pricing-rules');
  }

  async getPricingRule(id: number): Promise<PricingRule> {
    return apiClient.get<PricingRule>(`/admin/pricing-rules/${id}`);
  }

  async createPricingRule(data: CreatePricingRuleDto): Promise<PricingRule> {
    return apiClient.post<PricingRule>('/admin/pricing-rules', data);
  }

  async updatePricingRule(id: number, data: UpdatePricingRuleDto): Promise<PricingRule> {
    return apiClient.patch<PricingRule>(`/admin/pricing-rules/${id}`, data);
  }

  async deletePricingRule(id: number): Promise<void> {
    await apiClient.delete(`/admin/pricing-rules/${id}`);
  }

  async togglePricingRule(id: number, active: boolean): Promise<PricingRule> {
    return apiClient.patch<PricingRule>(`/admin/pricing-rules/${id}/${active}`);
  }

  async previewPrice(eventId: number): Promise<PriceCalculation> {
    return apiClient.get<PriceCalculation>(`/admin/pricing-rules/preview/${eventId}`);
  }
}

export const pricingService = new PricingService();
