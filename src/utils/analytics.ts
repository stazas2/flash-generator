import { AnalyticsEvent } from '@/types';

const subscribers = new Set<(event: AnalyticsEvent) => void>();

export const analytics = {
  subscribe(callback: (event: AnalyticsEvent) => void) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },
  track(event: AnalyticsEvent) {
    subscribers.forEach((callback) => callback(event));
    if (process.env.NODE_ENV === 'development') {
      console.info('[analytics]', event);
    }
  },
};
