import { useEffect, useState } from 'react';
import type { TelegramUser } from '../types';

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegram = () => {
  const [tg] = useState(() => window.Telegram?.WebApp);
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();

      // Применяем цвета темы Telegram
      const root = document.documentElement;
      const themeParams = (tg as any).themeParams || {};
      
      // Основные цвета
      if (themeParams.bg_color) root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
      if (themeParams.text_color) root.style.setProperty('--tg-theme-text-color', themeParams.text_color);
      if (themeParams.hint_color) root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color);
      if (themeParams.link_color) root.style.setProperty('--tg-theme-link-color', themeParams.link_color);
      if (themeParams.button_color) root.style.setProperty('--tg-theme-button-color', themeParams.button_color);
      if (themeParams.button_text_color) root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
      if (themeParams.secondary_bg_color) root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color);
      if (themeParams.header_bg_color) root.style.setProperty('--tg-theme-header-bg-color', themeParams.header_bg_color);
      if (themeParams.section_bg_color) root.style.setProperty('--tg-theme-section-bg-color', themeParams.section_bg_color);
      
      // Дополнительные цвета
      if (themeParams.section_separator_color) root.style.setProperty('--tg-theme-section-separator', themeParams.section_separator_color);
      if (themeParams.destructive_text_color) root.style.setProperty('--tg-theme-destructive-text-color', themeParams.destructive_text_color);
      
      // Устанавливаем цвет фона для body
      document.body.style.backgroundColor = themeParams.bg_color || themeParams.secondary_bg_color || '';

      // Получаем данные пользователя
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        setUser({
          id: tgUser.id,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name,
          username: tgUser.username,
          photo_url: tgUser.photo_url,
        });
      }
    } else {
      // Режим разработки - тестовый пользователь
      console.log('Telegram WebApp не найден - режим разработки');
    }
  }, [tg]);

  const showMainButton = (text: string, onClick: () => void) => {
    if (tg?.MainButton) {
      tg.MainButton.setText(text);
      tg.MainButton.show();
      tg.MainButton.enable();
      tg.MainButton.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    if (tg?.MainButton) {
      tg.MainButton.hide();
    }
  };

  const showBackButton = (onClick: () => void) => {
    if (tg?.BackButton) {
      tg.BackButton.show();
      tg.BackButton.onClick(onClick);
    }
  };

  const hideBackButton = () => {
    if (tg?.BackButton) {
      tg.BackButton.hide();
    }
  };

  const hapticFeedback = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(style);
    }
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    if (tg?.showConfirm) {
      tg.showConfirm(message, callback);
    } else {
      // Fallback для тестирования вне Telegram
      const confirmed = window.confirm(message);
      callback(confirmed);
    }
  };

  const showAlert = (message: string, callback?: () => void) => {
    if (tg?.showAlert) {
      tg.showAlert(message, callback);
    } else {
      // Fallback для тестирования вне Telegram
      window.alert(message);
      callback?.();
    }
  };

  return {
    tg,
    user,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showConfirm,
    showAlert,
  };
};
