// Типы данных для приложения

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface Participant {
  id: string;
  name: string;
}

export interface Bill {
  id: string;
  name: string;
  totalAmount: number;
  participants: Participant[];
  createdAt: Date;
  createdBy: TelegramUser | null;
  amountPerPerson?: number;
}

export type AppScreen = 'welcome' | 'create-name' | 'add-participants' | 'enter-amount' | 'result';

export interface BillStore {
  currentBill: Bill | null;
  savedBills: Bill[];
  telegramUser: TelegramUser | null;
  currentScreen: AppScreen;
  
  // Actions
  createBill: (name: string) => void;
  setTotalAmount: (amount: number) => void;
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
  calculateSplit: () => void;
  saveBill: () => void;
  resetCurrentBill: () => void;
  setTelegramUser: (user: TelegramUser) => void;
  setScreen: (screen: AppScreen) => void;
}
