import auto from './auto.json';
import airplane from './airplane.json';
import boat from './boat.json';
import ceramic from './ceramic.json';
import golfCart from './golf-cart.json';
import maintenance from './maintenance.json';
import rv from './rv.json';

export type PricingKey = 'auto' | 'airplane' | 'boat' | 'ceramic' | 'golf-cart' | 'maintenance' | 'rv';

export const pricingData: Record<PricingKey, typeof auto> = {
  auto,
  airplane,
  boat,
  ceramic,
  'golf-cart': golfCart,
  maintenance,
  rv,
};

export function getPricing(key: PricingKey) {
  return pricingData[key];
}
