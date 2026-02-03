import { useState } from 'react';
import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';
import { BillDetails } from './BillDetails';
import type { BillItem } from '../types';

export const EnterAmountScreen = () => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  
  const currentBill = useBillStore((state) => state.currentBill);
  const addItemToParticipant = useBillStore((state) => state.addItemToParticipant);
  const removeItemFromParticipant = useBillStore((state) => state.removeItemFromParticipant);
  const setScreen = useBillStore((state) => state.setScreen);
  const { hapticFeedback } = useTelegram();

  // Если режим равного разделения, показываем BillDetails
  if (currentBill?.splitMode === 'equal') {
    return <BillDetails />;
  }

  // Иначе показываем интерфейс для добавления позиций
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && itemPrice.trim() && selectedParticipantId) {
      const price = parseFloat(itemPrice);
      if (!isNaN(price) && price > 0) {
        const newItem: BillItem = {
          id: Date.now().toString(),
          name: itemName.trim(),
          price: price
        };
        addItemToParticipant(selectedParticipantId, newItem);
        setItemName('');
        setItemPrice('');
        hapticFeedback('light');
      }
    }
  };

  const handleRemoveItem = (participantId: string, itemId: string) => {
    removeItemFromParticipant(participantId, itemId);
    hapticFeedback('light');
  };

  const handleContinue = () => {
    setScreen('result');
    hapticFeedback('medium');
  };

  const getTotalAmount = () => {
    if (!currentBill) return 0;
    return currentBill.participants.reduce((sum, p) => {
      const participantTotal = p.items?.reduce((pSum, item) => pSum + item.price, 0) || 0;
      return sum + participantTotal;
    }, 0);
  };

  const canContinue = currentBill && currentBill.participants.some(p => (p.items?.length || 0) > 0);

  return (
    <div className="space-y-6 animate-fadeIn px-4">
      {/* Заголовок */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6 text-center">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
            Добавить позиции
          </h2>
          {currentBill && (
            <p className="text-base mt-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
              {currentBill.participants.length} участников
            </p>
          )}
        </div>
      </div>

      {/* Форма добавления позиции */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <form onSubmit={handleAddItem} className="p-6">
          <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}>
            ➕ Новая позиция
          </h3>

          {/* Выбор участника */}
          <select
            value={selectedParticipantId}
            onChange={(e) => setSelectedParticipantId(e.target.value)}
            className="w-full px-5 py-4 rounded-xl text-lg mb-4"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              border: 'none',
              outline: 'none',
              minHeight: 'var(--tap-target-min)'
            }}
          >
            <option value="">Выберите участника</option>
            {currentBill?.participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Название позиции */}
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Название (например: Пицца)"
            className="w-full px-5 py-4 rounded-xl text-lg mb-4"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              border: 'none',
              outline: 'none',
              minHeight: 'var(--tap-target-min)'
            }}
          />

          {/* Цена */}
          <div className="relative mb-4">
            <input
              type="text"
              inputMode="decimal"
              value={itemPrice}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^\d.]/g, '');
                const parts = cleaned.split('.');
                const formatted = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
                setItemPrice(formatted);
              }}
              placeholder="0"
              className="w-full px-5 py-4 rounded-xl text-lg pr-16"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                border: 'none',
                outline: 'none',
                minHeight: 'var(--tap-target-min)'
              }}
            />
            <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-lg font-bold" style={{ color: 'var(--tg-theme-hint-color)' }}>
              ₽
            </span>
          </div>

          <button
            type="submit"
            disabled={!itemName.trim() || !itemPrice.trim() || !selectedParticipantId}
            className="w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all active:scale-95"
            style={{
              backgroundColor: (itemName.trim() && itemPrice.trim() && selectedParticipantId) 
                ? 'var(--tg-theme-button-color)' 
                : 'var(--tg-theme-hint-color)',
              color: 'var(--tg-theme-button-text-color)',
              opacity: (itemName.trim() && itemPrice.trim() && selectedParticipantId) ? 1 : 0.5,
              minHeight: 'var(--tap-target-min)'
            }}
          >
            Добавить позицию
          </button>
        </form>
      </div>

      {/* Список позиций по участникам */}
      {currentBill && currentBill.participants.map((participant) => {
        const participantTotal = participant.items?.reduce((sum, item) => sum + item.price, 0) || 0;
        
        if (!participant.items || participant.items.length === 0) return null;

        return (
          <div key={participant.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
                  {participant.name}
                </h3>
                <span className="text-2xl font-bold" style={{ color: 'var(--tg-theme-button-color)' }}>
                  {participantTotal.toFixed(2)} ₽
                </span>
              </div>

              <div className="space-y-2">
                {participant.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-base" style={{ color: 'var(--tg-theme-text-color)' }}>
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg" style={{ color: 'var(--tg-theme-text-color)' }}>
                        {item.price.toFixed(2)} ₽
                      </span>
                      <button
                        onClick={() => handleRemoveItem(participant.id, item.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all active:scale-90"
                        style={{ 
                          color: 'var(--tg-theme-destructive-text-color)',
                          backgroundColor: 'var(--tg-theme-section-bg-color)'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Итоговая сумма и кнопка продолжить */}
      {canContinue && (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold" style={{ color: 'var(--tg-theme-hint-color)' }}>
                Итого:
              </span>
              <span className="text-4xl font-bold" style={{ color: 'var(--tg-theme-button-color)' }}>
                {getTotalAmount().toFixed(2)} ₽
              </span>
            </div>
            
            <button
              onClick={handleContinue}
              className="w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--tg-theme-button-color)',
                color: 'var(--tg-theme-button-text-color)',
                minHeight: 'var(--tap-target-min)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
              }}
            >
              Продолжить
            </button>
          </div>
        </div>
      )}

      {!canContinue && currentBill && (
        <div className="text-center py-10" style={{ color: 'var(--tg-theme-hint-color)' }}>
          <div className="text-6xl mb-4">🧾</div>
          <p className="text-lg">Добавьте позиции к участникам</p>
        </div>
      )}
    </div>
  );
};
