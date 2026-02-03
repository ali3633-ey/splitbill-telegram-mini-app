import { useState, useEffect } from 'react';
import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';
import { SimpleReceiptUpload } from './SimpleReceiptUpload';

export const BillDetails = () => {
  const [totalAmount, setTotalAmount] = useState('');
  const [participantName, setParticipantName] = useState('');

  const currentBill = useBillStore((state) => state.currentBill);
  const setTotalAmountStore = useBillStore((state) => state.setTotalAmount);
  const addParticipant = useBillStore((state) => state.addParticipant);
  const removeParticipant = useBillStore((state) => state.removeParticipant);
  const calculateSplit = useBillStore((state) => state.calculateSplit);
  const setScreen = useBillStore((state) => state.setScreen);

  const { hapticFeedback, showConfirm } = useTelegram();

  // Синхронизация поля ввода с значением из store (при OCR)
  useEffect(() => {
    if (currentBill?.totalAmount && currentBill.totalAmount > 0) {
      setTotalAmount(currentBill.totalAmount.toString());
    }
  }, [currentBill?.totalAmount]);

  if (!currentBill) {
    return null;
  }

  const handleAmountChange = (value: string) => {
    setTotalAmount(value);
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount >= 0) {
      setTotalAmountStore(amount);
      calculateSplit();
      hapticFeedback('light');
    }
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (participantName.trim()) {
      addParticipant(participantName);
      setParticipantName('');
      hapticFeedback('light');
    }
  };

  const handleRemoveParticipant = (id: string) => {
    showConfirm?.('Удалить участника?', (confirmed: boolean) => {
      if (confirmed) {
        removeParticipant(id);
        hapticFeedback('medium');
      }
    });
  };

  const handleSaveBill = () => {
    if (currentBill && currentBill.totalAmount > 0 && currentBill.participants.length > 0) {
      setScreen('result');
      hapticFeedback('medium');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn px-4">
      {/* Заголовок */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6 text-center">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
            {currentBill.name}
          </h2>
          <p className="text-base mt-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
            {new Date(currentBill.createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Загрузка чека */}
      <SimpleReceiptUpload />

      {/* Общая сумма */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6">
          <label 
            htmlFor="totalAmount" 
            className="block text-sm font-semibold mb-4 uppercase tracking-wide" 
            style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}
          >
            Общая сумма
          </label>
          <div className="relative">
            <input
              type="number"
              id="totalAmount"
              value={totalAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              step="0.01"
              min="0"
              inputMode="decimal"
              className="w-full px-5 py-4 text-3xl font-bold rounded-xl pr-16"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                border: 'none',
                outline: 'none',
                minHeight: 'var(--tap-target-min)'
              }}
            />
            <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-3xl font-bold" style={{ color: 'var(--tg-theme-hint-color)' }}>
              ₽
            </span>
          </div>
        </div>
      </div>

      {/* Добавление участников */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6">
          <h3 className="text-sm font-semibold mb-5 uppercase tracking-wide" style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}>
            Участники
          </h3>
          <form onSubmit={handleAddParticipant} className="mb-5">
            <div className="flex gap-3">
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Имя участника"
                className="flex-1 px-5 py-4 rounded-xl text-lg"
                style={{
                  backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  border: 'none',
                  outline: 'none',
                  minHeight: 'var(--tap-target-min)'
                }}
              />
              <button
                type="submit"
                disabled={!participantName.trim()}
                className="px-6 py-4 rounded-xl font-bold text-xl transition-all active:scale-95"
                style={{
                  backgroundColor: participantName.trim() ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)',
                  color: 'var(--tg-theme-button-text-color)',
                  opacity: participantName.trim() ? 1 : 0.5,
                  minWidth: '60px',
                  minHeight: 'var(--tap-target-min)'
                }}
              >
                +
              </button>
            </div>
          </form>

        {/* Список участников */}
        {currentBill.participants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-base" style={{ color: 'var(--tg-theme-hint-color)' }}>
              Добавьте участников для<br/>разделения счёта
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentBill.participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-4 rounded-xl transition-all active:scale-98"
                style={{ 
                  backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                  minHeight: 'var(--tap-target-min)'
                }}
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg" style={{ color: 'var(--tg-theme-text-color)' }}>
                    {participant.name}
                  </p>
                  {currentBill.amountPerPerson !== undefined && currentBill.amountPerPerson > 0 && (
                    <p className="text-base font-medium mt-1" style={{ color: 'var(--tg-theme-hint-color)' }}>
                      {currentBill.amountPerPerson.toFixed(2)} ₽
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveParticipant(participant.id)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold transition-all active:scale-90"
                  style={{ 
                    color: 'var(--tg-theme-destructive-text-color)',
                    backgroundColor: 'var(--tg-theme-section-bg-color)'
                  }}
                  aria-label="Удалить участника"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Итого */}
      {currentBill.participants.length > 0 && currentBill.totalAmount > 0 && (
        <div className="rounded-2xl overflow-hidden p-8 animate-fadeIn text-center" style={{ 
          backgroundColor: 'var(--tg-theme-button-color)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}>
          <div className="mb-6">
            <div className="mb-6">
              <p className="text-sm font-medium opacity-90 mb-2" style={{ color: 'var(--tg-theme-button-text-color)' }}>
                Всего участников
              </p>
              <p className="text-4xl font-bold" style={{ color: 'var(--tg-theme-button-text-color)' }}>
                {currentBill.participants.length}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium opacity-90 mb-2" style={{ color: 'var(--tg-theme-button-text-color)' }}>
                На каждого
              </p>
              <p className="text-4xl font-bold" style={{ color: 'var(--tg-theme-button-text-color)' }}>
                {(currentBill.totalAmount / currentBill.participants.length).toFixed(2)} ₽
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveBill}
            className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all active:scale-95"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: 'var(--tg-theme-button-color)',
              minHeight: 'var(--tap-target-min)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            Продолжить
          </button>
        </div>
      )}
    </div>
  );
};
