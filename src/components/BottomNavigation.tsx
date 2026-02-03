import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';

export const BottomNavigation = () => {
  const currentScreen = useBillStore((state) => state.currentScreen);
  const setScreen = useBillStore((state) => state.setScreen);
  const { hapticFeedback } = useTelegram();

  const handleNavigate = (screen: 'welcome' | 'ocr' | 'favorites' | 'profile') => {
    setScreen(screen);
    hapticFeedback('light');
  };

  const isActive = (screen: string) => currentScreen === screen;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 border-t"
      style={{ 
        backgroundColor: 'var(--tg-theme-section-bg-color)',
        borderColor: 'var(--tg-theme-section-separator)',
        zIndex: 100
      }}
    >
      <div className="max-w-2xl mx-auto flex justify-around items-center py-2">
        {/* Главная */}
        <button
          onClick={() => handleNavigate('welcome')}
          className="flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all active:scale-95"
          style={{
            color: isActive('welcome') ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)',
            minHeight: 'var(--tap-target-min)'
          }}
        >
          <span className="text-2xl mb-1">🏠</span>
          <span className="text-xs font-semibold">Главная</span>
        </button>

        {/* По фото */}
        <button
          onClick={() => handleNavigate('ocr')}
          className="flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all active:scale-95"
          style={{
            color: isActive('ocr') ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)',
            minHeight: 'var(--tap-target-min)'
          }}
        >
          <span className="text-2xl mb-1">📸</span>
          <span className="text-xs font-semibold">По фото</span>
        </button>

        {/* Избранное */}
        <button
          onClick={() => handleNavigate('favorites')}
          className="flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all active:scale-95"
          style={{
            color: isActive('favorites') ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)',
            minHeight: 'var(--tap-target-min)'
          }}
        >
          <span className="text-2xl mb-1">⭐</span>
          <span className="text-xs font-semibold">Избранное</span>
        </button>

        {/* Профиль */}
        <button
          onClick={() => handleNavigate('profile')}
          className="flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all active:scale-95"
          style={{
            color: isActive('profile') ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)',
            minHeight: 'var(--tap-target-min)'
          }}
        >
          <span className="text-2xl mb-1">👤</span>
          <span className="text-xs font-semibold">Профиль</span>
        </button>
      </div>
    </nav>
  );
};
