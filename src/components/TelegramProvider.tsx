import { useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import { useBillStore } from '../store/useBillStore';

interface TelegramProviderProps {
  children: React.ReactNode;
}

export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  const { user } = useTelegram();
  const setTelegramUser = useBillStore((state) => state.setTelegramUser);

  useEffect(() => {
    if (user) {
      setTelegramUser(user);
    }
  }, [user, setTelegramUser]);

  return <>{children}</>;
};
