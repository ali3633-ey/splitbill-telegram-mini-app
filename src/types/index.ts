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
  items?: BillItem[];
  totalAmount?: number;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
}

export type SplitMode = 'equal' | 'detailed';

export interface FavoritePlace {
  id: string;
  name: string;
  address?: string;
  rating?: number;
  notes?: string;
  createdAt: Date;
}

export interface Bill {
  id: string;
  name: string;
  totalAmount: number;
  participants: Participant[];
  createdAt: Date;
  createdBy: TelegramUser | null;
  amountPerPerson?: number;
  splitMode?: SplitMode;
  receiptPhoto?: string;
}

export type AppScreen = 'welcome' | 'create-name' | 'add-participants' | 'enter-amount' | 'result' | 'ocr' | 'profile' | 'select-mode' | 'favorites';

export interface BillStore {
  currentBill: Bill | null;
  savedBills: Bill[];
  telegramUser: TelegramUser | null;
  currentScreen: AppScreen;
  favoritePlaces: FavoritePlace[];
  
  // Actions
  createBill: (name: string) => void;
  setTotalAmount: (amount: number) => void;
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
  addItemToParticipant: (participantId: string, item: BillItem) => void;
  removeItemFromParticipant: (participantId: string, itemId: string) => void;
  calculateSplit: () => void;
  saveBill: () => void;
  resetCurrentBill: () => void;
  setTelegramUser: (user: TelegramUser) => void;
  setScreen: (screen: AppScreen) => void;
  setSplitMode: (mode: SplitMode) => void;
  setReceiptPhoto: (photo: string) => void;
  addFavoritePlace: (place: Omit<FavoritePlace, 'id' | 'createdAt'>) => void;
  removeFavoritePlace: (id: string) => void;
}
