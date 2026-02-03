import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';

export const WelcomeScreen = () => {
  const setScreen = useBillStore((state) => state.setScreen);
  const savedBills = useBillStore((state) => state.savedBills);
  const { hapticFeedback } = useTelegram();

  const handleCreateBill = () => {
    hapticFeedback('light');
    setScreen('create-name');
  };

  return (
    <div className="space-y-6 animate-fadeIn px-4 pb-24">
      {/* Приветствие */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-8 text-center">
          <div className="text-6xl mb-4">💸</div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--tg-theme-text-color)' }}>
            SplitBill
          </h1>
          <p className="text-lg" style={{ color: 'var(--tg-theme-hint-color)' }}>
            Разделите счёт за пару кликов
          </p>
        </div>
      </div>

      {/* Кнопка создания */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6">
          <button
            onClick={handleCreateBill}
            className="w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all active:scale-95"
            style={{
              backgroundColor: 'var(--tg-theme-button-color)',
              color: 'var(--tg-theme-button-text-color)',
              minHeight: 'var(--tap-target-min)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
            }}
          >
            ➕ Создать счёт
          </button>
        </div>
      </div>

      {/* Сохраненные счета (если есть) */}
      {savedBills.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
          <div className="p-6">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}>
              📋 Сохраненные счета
            </h3>
            <div className="space-y-2">
              {savedBills.slice(-3).reverse().map((bill) => (
                <div
                  key={bill.id}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
                >
                  <p className="font-semibold text-base" style={{ color: 'var(--tg-theme-text-color)' }}>
                    {bill.name}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--tg-theme-hint-color)' }}>
                    {bill.totalAmount} ₽ · {bill.participants.length} чел.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
