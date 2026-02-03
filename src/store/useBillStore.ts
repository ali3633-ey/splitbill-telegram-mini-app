import { create } from 'zustand';
import type { BillStore, Bill, TelegramUser, AppScreen, BillItem, SplitMode, FavoritePlace } from '../types';
// import { splitBill } from '../utils/splitBill'; // Будет использоваться позже для детального разделения

export const useBillStore = create<BillStore>((set, get) => ({
  currentBill: null,
  savedBills: [],
  telegramUser: null,
  currentScreen: 'welcome',
  favoritePlaces: [],

  setScreen: (screen: AppScreen) => {
    set({ currentScreen: screen });
  },

  createBill: (name: string) => {
    const newBill: Bill = {
      id: Date.now().toString(),
      name,
      totalAmount: 0,
      participants: [],
      createdAt: new Date(),
      createdBy: get().telegramUser,
      splitMode: 'equal',
    };
    set({ currentBill: newBill, currentScreen: 'select-mode' });
  },

  setSplitMode: (mode: SplitMode) => {
    const { currentBill } = get();
    if (currentBill) {
      set({
        currentBill: {
          ...currentBill,
          splitMode: mode,
        },
        currentScreen: 'add-participants',
      });
    }
  },

  setReceiptPhoto: (photo: string) => {
    const { currentBill } = get();
    if (currentBill) {
      set({
        currentBill: {
          ...currentBill,
          receiptPhoto: photo,
        },
      });
    }
  },

  setTotalAmount: (amount: number) => {
    const { currentBill } = get();
    if (currentBill) {
      set({
        currentBill: {
          ...currentBill,
          totalAmount: amount,
        },
      });
      get().calculateSplit();
    }
  },

  addParticipant: (name: string) => {
    const { currentBill } = get();
    if (currentBill) {
      const newParticipant = {
        id: Date.now().toString(),
        name,
        items: [],
        totalAmount: 0,
      };
      set({
        currentBill: {
          ...currentBill,
          participants: [...currentBill.participants, newParticipant],
        },
      });
      get().calculateSplit();
    }
  },

  removeParticipant: (id: string) => {
    const { currentBill } = get();
    if (currentBill) {
      set({
        currentBill: {
          ...currentBill,
          participants: currentBill.participants.filter((p) => p.id !== id),
        },
      });
      get().calculateSplit();
    }
  },

  addItemToParticipant: (participantId: string, item: BillItem) => {
    const { currentBill } = get();
    if (currentBill) {
      const updatedParticipants = currentBill.participants.map((p) => {
        if (p.id === participantId) {
          const newItems = [...(p.items || []), item];
          const newTotal = newItems.reduce((sum, i) => sum + i.price, 0);
          return { ...p, items: newItems, totalAmount: newTotal };
        }
        return p;
      });
      
      const newTotalAmount = updatedParticipants.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
      
      set({
        currentBill: {
          ...currentBill,
          participants: updatedParticipants,
          totalAmount: newTotalAmount,
        },
      });
    }
  },

  removeItemFromParticipant: (participantId: string, itemId: string) => {
    const { currentBill } = get();
    if (currentBill) {
      const updatedParticipants = currentBill.participants.map((p) => {
        if (p.id === participantId) {
          const newItems = (p.items || []).filter((i) => i.id !== itemId);
          const newTotal = newItems.reduce((sum, i) => sum + i.price, 0);
          return { ...p, items: newItems, totalAmount: newTotal };
        }
        return p;
      });
      
      const newTotalAmount = updatedParticipants.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
      
      set({
        currentBill: {
          ...currentBill,
          participants: updatedParticipants,
          totalAmount: newTotalAmount,
        },
      });
    }
  },

  calculateSplit: () => {
    const { currentBill } = get();
    if (currentBill && currentBill.participants.length > 0) {
      // Если есть items у участников, считаем их суммы
      const hasItems = currentBill.participants.some(p => (p.items?.length || 0) > 0);
      
      if (hasItems) {
        // Пересчитываем totalAmount на основе items
        const totalAmount = currentBill.participants.reduce((sum, p) => 
          sum + (p.totalAmount || 0), 0
        );
        
        set({
          currentBill: {
            ...currentBill,
            totalAmount,
          },
        });
      } else if (currentBill.totalAmount > 0) {
        // Старая логика для равного разделения
        const amountPerPerson = currentBill.totalAmount / currentBill.participants.length;
        
        set({
          currentBill: {
            ...currentBill,
            amountPerPerson: Math.round(amountPerPerson * 100) / 100,
          },
        });
      }
    }
  },

  saveBill: () => {
    const { currentBill, savedBills } = get();
    if (currentBill) {
      set({
        savedBills: [...savedBills, currentBill],
      });
    }
  },

  resetCurrentBill: () => {
    set({ currentBill: null, currentScreen: 'welcome' });
  },

  setTelegramUser: (user: TelegramUser) => {
    set({ telegramUser: user });
  },

  addFavoritePlace: (place: Omit<FavoritePlace, 'id' | 'createdAt'>) => {
    const newPlace: FavoritePlace = {
      ...place,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    set((state) => ({
      favoritePlaces: [...state.favoritePlaces, newPlace],
    }));
  },

  removeFavoritePlace: (id: string) => {
    set((state) => ({
      favoritePlaces: state.favoritePlaces.filter((place) => place.id !== id),
    }));
  },
}));
