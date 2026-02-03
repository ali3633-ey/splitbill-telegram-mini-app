import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';

export const SelectModeScreen = () => {
  const currentBill = useBillStore((state) => state.currentBill);
  const setSplitMode = useBillStore((state) => state.setSplitMode);
  const { hapticFeedback } = useTelegram();

  if (!currentBill) {
    return null;
  }

  const handleModeSelect = (mode: 'equal' | 'detailed') => {
    setSplitMode(mode);
    hapticFeedback('medium');
  };

  return (
    <div className="space-y-6 animate-fadeIn px-4">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--tg-theme-text-color)' }}>
          {currentBill.name}
        </h1>
        <p className="text-lg" style={{ color: 'var(--tg-theme-hint-color)' }}>
          Как разделить счёт?
        </p>
      </div>

      {/* Режим поровну */}
      <button
        onClick={() => handleModeSelect('equal')}
        className="w-full rounded-2xl overflow-hidden transition-all active:scale-98"
        style={{ 
          backgroundColor: 'var(--tg-theme-section-bg-color)',
          minHeight: 'var(--tap-target-min)'
        }}
      >
        <div className="p-8 text-center">
          <div className="text-6xl mb-4">⚖️</div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--tg-theme-text-color)' }}>
            Поровну
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--tg-theme-hint-color)' }}>
            Разделить общую сумму<br/>поровну между всеми участниками
          </p>
        </div>
      </button>

      {/* Детальный режим */}
      <button
        onClick={() => handleModeSelect('detailed')}
        className="w-full rounded-2xl overflow-hidden transition-all active:scale-98"
        style={{ 
          backgroundColor: 'var(--tg-theme-section-bg-color)',
          minHeight: 'var(--tap-target-min)'
        }}
      >
        <div className="p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--tg-theme-text-color)' }}>
            По позициям
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--tg-theme-hint-color)' }}>
            Добавить позиции для каждого<br/>участника индивидуально
          </p>
        </div>
      </button>

      {/* Подсказка */}
      <div 
        className="rounded-2xl p-6 text-center"
        style={{ 
          backgroundColor: 'var(--tg-theme-section-bg-color)',
          opacity: 0.8
        }}
      >
        <p className="text-sm" style={{ color: 'var(--tg-theme-hint-color)' }}>
          💡 В режиме "По позициям" вы сможете указать, кто за что платит
        </p>
      </div>
    </div>
  );
};
