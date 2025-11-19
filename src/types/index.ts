export interface Card {
  id: string;
  question: string;
  answer: string;
}

export interface Deck {
  id: string;
  name: string;
  createdAt: string;
  description?: string;
  cards: Card[];
}

export interface AnalyticsEvent {
  event: string;
  props?: Record<string, unknown>;
  timestamp: number;
}

export interface GenerateRequest {
  text: string;
  count: number;
}
