import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';

export const ResultScreen = () => {
  const currentBill = useBillStore((state) => state.currentBill);
  const saveBill = useBillStore((state) => state.saveBill);
  const resetCurrentBill = useBillStore((state) => state.resetCurrentBill);
  const setScreen = useBillStore((state) => state.setScreen);
  const { hapticFeedback, showConfirm } = useTelegram();

  if (!currentBill) {
    return null;
  }

  const amountPerPerson = currentBill.totalAmount / currentBill.participants.length;

  const handleShare = () => {
    const text = `Счёт: ${currentBill.name}\n${currentBill.participants.map(p => `${p.name} — ${amountPerPerson.toFixed(2)} ₽`).join('\n')}`;
    
    if (navigator.share) {
      navigator.share({
        title: currentBill.name,
        text: text,
      }).then(() => {
        hapticFeedback('light');
      }).catch(() => {
        // Копируем в буфер если share не работает
        navigator.clipboard.writeText(text);
        hapticFeedback('light');
      });
    } else {
      // Копируем в буфер
      navigator.clipboard.writeText(text);
      hapticFeedback('light');
    }
  };

  const handleEdit = () => {
    setScreen('enter-amount');
    hapticFeedback('light');
  };

  const handleNewBill = () => {
    saveBill();
    hapticFeedback('medium');
    
    if (showConfirm) {
      showConfirm('Создать новый счёт?', (confirmed: boolean) => {
        if (confirmed) {
          resetCurrentBill();
        }
      });
    } else {
      // Если showConfirm не доступен, просто сбрасываем
      resetCurrentBill();
    }
  };

  const copyAmount = (amount: number) => {
    navigator.clipboard.writeText(amount.toFixed(2));
    hapticFeedback('light');
  };

  return (
    <div className="space-y-6 animate-fadeIn px-4">
      {/* Заголовок */}
      <div className="rounded-2xl overflow-hidden text-center p-8" style={{ 
        backgroundColor: 'var(--tg-theme-button-color)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--tg-theme-button-text-color)' }}>
          Итого
        </h2>
        <p className="text-xl" style={{ color: 'var(--tg-theme-button-text-color)', opacity: 0.9 }}>
          {currentBill.name}
        </p>
      </div>

      {/* Карточки участников */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6">
          <h3 className="text-sm font-semibold mb-5 uppercase tracking-wide" style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}>
            По {amountPerPerson.toFixed(2)} ₽ с каждого
          </h3>
          <div className="space-y-3">
            {currentBill.participants.map((participant) => (
              <button
                key={participant.id}
                onClick={() => copyAmount(amountPerPerson)}
                className="w-full flex items-center justify-between p-5 rounded-xl transition-all active:scale-98"
                style={{
                  backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                  minHeight: 'var(--tap-target-min)'
                }}
              >
                <span className="font-semibold text-xl" style={{ color: 'var(--tg-theme-text-color)' }}>
                  {participant.name}
                </span>
                <span className="font-bold text-2xl" style={{ color: 'var(--tg-theme-button-color)' }}>
                  {amountPerPerson.toFixed(2)} ₽
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs mt-4 text-center" style={{ color: 'var(--tg-theme-hint-color)' }}>
            💡 Нажмите на карточку, чтобы скопировать сумму
          </p>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="space-y-3">
        <button
          onClick={handleShare}
          className="w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all active:scale-95"
          style={{
            backgroundColor: 'var(--tg-theme-button-color)',
            color: 'var(--tg-theme-button-text-color)',
            minHeight: 'var(--tap-target-min)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          📤 Поделиться
        </button>

        <button
          onClick={handleEdit}
          className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all active:scale-95"
          style={{
            backgroundColor: 'var(--tg-theme-secondary-bg-color)',
            color: 'var(--tg-theme-text-color)',
            minHeight: 'var(--tap-target-min)'
          }}
        >
          🔁 Изменить
        </button>

        <button
          onClick={handleNewBill}
          className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all active:scale-95"
          style={{
            backgroundColor: 'var(--tg-theme-section-bg-color)',
            color: 'var(--tg-theme-link-color)',
            minHeight: 'var(--tap-target-min)'
          }}
        >
          ➕ Новый счёт
        </button>
      </div>
    </div>
  );
};
