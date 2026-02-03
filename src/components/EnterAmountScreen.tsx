import { useState } from 'react';
import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';
import { ReceiptUpload } from './ReceiptUpload';

export const EnterAmountScreen = () => {
  const [amount, setAmount] = useState('');
  const [showOCR, setShowOCR] = useState(false);
  const currentBill = useBillStore((state) => state.currentBill);
  const setTotalAmount = useBillStore((state) => state.setTotalAmount);
  const calculateSplit = useBillStore((state) => state.calculateSplit);
  const setScreen = useBillStore((state) => state.setScreen);
  const { hapticFeedback } = useTelegram();

  const handleAmountChange = (value: string) => {
    // Разрешаем только числа и одну точку
    const cleaned = value.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    const formatted = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
    
    setAmount(formatted);
  };

  const handleSplit = () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      setTotalAmount(numAmount);
      calculateSplit();
      setScreen('result');
      hapticFeedback('medium');
    }
  };

  const canSplit = amount.trim() && parseFloat(amount) > 0;

  return (
    <div className="space-y-6 animate-fadeIn px-4">
      {/* Заголовок */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6 text-center">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
            Сколько вышло?
          </h2>
          {currentBill && (
            <p className="text-base mt-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
              {currentBill.participants.length} участников
            </p>
          )}
        </div>
      </div>

      {/* Ввод суммы */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-8">
          <div className="relative mb-6">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              autoFocus
              className="w-full px-5 py-4 text-5xl font-bold rounded-xl pr-16 text-center"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                border: 'none',
                outline: 'none',
                minHeight: 'var(--tap-target-min)'
              }}
            />
            <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-4xl font-bold" style={{ color: 'var(--tg-theme-hint-color)' }}>
              ₽
            </span>
          </div>

          {/* Переключатель (пока только поровну) */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--tg-theme-button-color)' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--tg-theme-button-text-color)' }}></div>
              </div>
              <span className="text-base font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                Делить поровну
              </span>
            </div>
          </div>

          <button
            onClick={handleSplit}
            disabled={!canSplit}
            className="w-full py-5 px-6 rounded-2xl font-bold text-xl mt-6 transition-all active:scale-95"
            style={{
              backgroundColor: canSplit ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)',
              color: 'var(--tg-theme-button-text-color)',
              opacity: canSplit ? 1 : 0.5,
              minHeight: 'var(--tap-target-min)',
              boxShadow: canSplit ? '0 4px 16px rgba(0,0,0,0.15)' : 'none'
            }}
          >
            Разделить
          </button>
        </div>
      </div>

      {/* Кнопка загрузки чека */}
      {!showOCR && (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
          <div className="p-6">
            <button
              onClick={() => setShowOCR(true)}
              className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                border: `2px dashed var(--tg-theme-hint-color)`,
                minHeight: 'var(--tap-target-min)'
              }}
            >
              📸 Загрузить чек
            </button>
          </div>
        </div>
      )}

      {/* OCR компонент */}
      {showOCR && (
        <div>
          <ReceiptUpload />
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowOCR(false)}
              className="text-base font-semibold px-6 py-3 rounded-lg transition-all active:scale-95"
              style={{ color: 'var(--tg-theme-link-color)' }}
            >
              Скрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
