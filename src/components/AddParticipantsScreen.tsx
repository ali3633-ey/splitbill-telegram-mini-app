import { useState } from 'react';
import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';

export const AddParticipantsScreen = () => {
  const [participantName, setParticipantName] = useState('');
  const currentBill = useBillStore((state) => state.currentBill);
  const addParticipant = useBillStore((state) => state.addParticipant);
  const removeParticipant = useBillStore((state) => state.removeParticipant);
  const setScreen = useBillStore((state) => state.setScreen);
  const telegramUser = useBillStore((state) => state.telegramUser);
  const { hapticFeedback } = useTelegram();

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (participantName.trim()) {
      addParticipant(participantName);
      setParticipantName('');
      hapticFeedback('light');
    }
  };

  const handleAddMe = () => {
    if (telegramUser) {
      const name = telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : '');
      addParticipant(name);
      hapticFeedback('light');
    }
  };

  const handleRemove = (id: string) => {
    removeParticipant(id);
    hapticFeedback('light');
  };

  const handleContinue = () => {
    if ((currentBill?.participants.length || 0) >= 2) {
      setScreen('enter-amount');
      hapticFeedback('light');
    }
  };

  const canContinue = (currentBill?.participants.length || 0) >= 2;

  return (
    <div className="space-y-6 animate-fadeIn px-4">
      {/* Заголовок */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6 text-center">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
            Кто был?
          </h2>
          <p className="text-base mt-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
            Минимум 2 участника
          </p>
        </div>
      </div>

      {/* Форма добавления */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6">
          <form onSubmit={handleAddParticipant} className="mb-5">
            <div className="flex gap-3">
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Имя участника"
                autoFocus
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
                ➕
              </button>
            </div>
          </form>

          {/* Кнопка "Добавить меня" */}
          {telegramUser && (
            <button
              onClick={handleAddMe}
              className="w-full py-3 px-5 rounded-xl font-medium text-base mb-5 transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-link-color)',
                border: `2px dashed var(--tg-theme-link-color)`
              }}
            >
              ➕ Добавить меня
            </button>
          )}

          {/* Список участников */}
          {currentBill && currentBill.participants.length > 0 && (
            <div className="space-y-3">
              {currentBill.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-4 rounded-xl transition-all"
                  style={{
                    backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                    minHeight: 'var(--tap-target-min)'
                  }}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-lg" style={{ color: 'var(--tg-theme-text-color)' }}>
                      {participant.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(participant.id)}
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

          {currentBill && currentBill.participants.length === 0 && (
            <div className="text-center py-10" style={{ color: 'var(--tg-theme-hint-color)' }}>
              <div className="text-6xl mb-4">👥</div>
              <p className="text-lg">Добавьте участников</p>
            </div>
          )}
        </div>
      </div>

      {/* Кнопка продолжить */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all active:scale-95"
            style={{
              backgroundColor: canContinue ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)',
              color: 'var(--tg-theme-button-text-color)',
              opacity: canContinue ? 1 : 0.5,
              minHeight: 'var(--tap-target-min)',
              boxShadow: canContinue ? '0 4px 16px rgba(0,0,0,0.15)' : 'none'
            }}
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};
