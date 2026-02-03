import { useState } from 'react';
import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';

export const CreateNameScreen = () => {
  const [billName, setBillName] = useState('');
  const createBill = useBillStore((state) => state.createBill);
  const setScreen = useBillStore((state) => state.setScreen);
  const { hapticFeedback } = useTelegram();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (billName.trim()) {
      createBill(billName);
      hapticFeedback('light');
    }
  };

  const handleSkip = () => {
    createBill('Новый счёт');
    hapticFeedback('light');
  };

  return (
    <div className="space-y-6 animate-fadeIn px-4">
      {/* Заголовок */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6 text-center">
          <button
            onClick={() => setScreen('welcome')}
            className="text-2xl mb-4"
            style={{ color: 'var(--tg-theme-hint-color)' }}
          >
            ←
          </button>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
            Новый счёт
          </h2>
        </div>
      </div>

      {/* Форма */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <form onSubmit={handleSubmit} className="p-8">
          <label 
            htmlFor="billName" 
            className="block text-sm font-semibold mb-6 uppercase tracking-wide" 
            style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}
          >
            Название (необязательно)
          </label>
          <input
            type="text"
            id="billName"
            value={billName}
            onChange={(e) => setBillName(e.target.value)}
            placeholder="Например: Пятница в баре"
            autoFocus
            className="w-full px-5 py-4 rounded-xl text-lg font-medium mb-8"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              border: 'none',
              outline: 'none',
              minHeight: 'var(--tap-target-min)'
            }}
          />
          
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--tg-theme-button-color)',
                color: 'var(--tg-theme-button-text-color)',
                minHeight: 'var(--tap-target-min)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              Продолжить
            </button>
            
            {!billName.trim() && (
              <button
                type="button"
                onClick={handleSkip}
                className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all active:scale-95"
                style={{
                  backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  minHeight: 'var(--tap-target-min)'
                }}
              >
                Пропустить
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
