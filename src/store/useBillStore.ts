import { create } from 'zustand';
import type { BillStore, Bill, TelegramUser, AppScreen } from '../types';
// import { splitBill } from '../utils/splitBill'; // Будет использоваться позже для детального разделения

export const useBillStore = create<BillStore>((set, get) => ({
  currentBill: null,
  savedBills: [],
  telegramUser: null,
  currentScreen: 'welcome',

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
    };
    set({ currentBill: newBill, currentScreen: 'add-participants' });
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

  calculateSplit: () => {
    const { currentBill } = get();
    if (currentBill && currentBill.participants.length > 0 && currentBill.totalAmount > 0) {
      // Используем чистую функцию для точного расчёта (shares можно использовать для детального отображения)
      // const shares = splitBill(currentBill.participants, currentBill.totalAmount, 'equal');
      
      // Вычисляем среднюю сумму для отображения
      const amountPerPerson = currentBill.totalAmount / currentBill.participants.length;
      
      set({
        currentBill: {
          ...currentBill,
          amountPerPerson: Math.round(amountPerPerson * 100) / 100,
        },
      });
    } else if (currentBill) {
      set({
        currentBill: {
          ...currentBill,
          amountPerPerson: 0,
        },
      });
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
}));
