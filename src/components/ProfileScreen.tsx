import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';

export const ProfileScreen = () => {
  const telegramUser = useBillStore((state) => state.telegramUser);
  const savedBills = useBillStore((state) => state.savedBills);
  const { hapticFeedback } = useTelegram();

  const handleCopyUsername = () => {
    if (telegramUser?.username) {
      navigator.clipboard.writeText(`@${telegramUser.username}`);
      hapticFeedback('light');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn px-4 pb-24">
      {/* Профиль */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-8 text-center">
          {/* Аватар */}
          {telegramUser?.photo_url ? (
            <img
              src={telegramUser.photo_url}
              alt="Avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4"
              style={{ borderColor: 'var(--tg-theme-button-color)' }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl"
              style={{ backgroundColor: 'var(--tg-theme-button-color)' }}
            >
              <span style={{ color: 'var(--tg-theme-button-text-color)' }}>
                {telegramUser?.first_name?.charAt(0) || '👤'}
              </span>
            </div>
          )}

          {/* Имя */}
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--tg-theme-text-color)' }}>
            {telegramUser?.first_name || 'Гость'} {telegramUser?.last_name || ''}
          </h2>

          {/* Username */}
          {telegramUser?.username && (
            <button
              onClick={handleCopyUsername}
              className="text-lg px-4 py-2 rounded-lg transition-all active:scale-95"
              style={{ color: 'var(--tg-theme-link-color)' }}
            >
              @{telegramUser.username}
            </button>
          )}
        </div>
      </div>

      {/* История счетов */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}>
              📋 История счетов
            </h3>
            <span className="text-lg font-bold px-3 py-1 rounded-lg" style={{ 
              backgroundColor: 'var(--tg-theme-button-color)',
              color: 'var(--tg-theme-button-text-color)'
            }}>
              {savedBills.length}
            </span>
          </div>

          {savedBills.length === 0 ? (
            <div className="text-center py-10" style={{ color: 'var(--tg-theme-hint-color)' }}>
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg">История пуста</p>
              <p className="text-sm mt-2">Счета появятся после сохранения</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedBills.slice().reverse().map((bill) => (
                <div
                  key={bill.id}
                  className="p-5 rounded-xl transition-all"
                  style={{
                    backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                  }}
                >
                  {/* Название */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold mb-1" style={{ color: 'var(--tg-theme-text-color)' }}>
                        {bill.name}
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--tg-theme-hint-color)' }}>
                        {new Date(bill.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: 'var(--tg-theme-button-color)' }}>
                        {bill.totalAmount.toFixed(2)} ₽
                      </p>
                    </div>
                  </div>

                  {/* Участники */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold uppercase" style={{ color: 'var(--tg-theme-hint-color)' }}>
                      Участники:
                    </span>
                    {bill.participants.slice(0, 3).map((participant) => (
                      <span
                        key={participant.id}
                        className="text-sm px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: 'var(--tg-theme-section-bg-color)',
                          color: 'var(--tg-theme-text-color)'
                        }}
                      >
                        {participant.name}
                      </span>
                    ))}
                    {bill.participants.length > 3 && (
                      <span className="text-sm px-3 py-1 rounded-full" style={{
                        backgroundColor: 'var(--tg-theme-section-bg-color)',
                        color: 'var(--tg-theme-hint-color)'
                      }}>
                        +{bill.participants.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Сумма на человека */}
                  {bill.amountPerPerson && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--tg-theme-section-separator)' }}>
                      <p className="text-sm" style={{ color: 'var(--tg-theme-hint-color)' }}>
                        По {bill.amountPerPerson.toFixed(2)} ₽ с каждого
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Статистика */}
      {savedBills.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
          <div className="p-6">
            <h3 className="text-sm font-semibold mb-5 uppercase tracking-wide" style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}>
              📊 Статистика
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--tg-theme-button-color)' }}>
                  {savedBills.length}
                </p>
                <p className="text-sm" style={{ color: 'var(--tg-theme-hint-color)' }}>
                  Счетов
                </p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}>
                <p className="text-3xl font-bold mb-1" style={{ color: 'var(--tg-theme-button-color)' }}>
                  {savedBills.reduce((sum, bill) => sum + bill.totalAmount, 0).toFixed(0)} ₽
                </p>
                <p className="text-sm" style={{ color: 'var(--tg-theme-hint-color)' }}>
                  Всего
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
