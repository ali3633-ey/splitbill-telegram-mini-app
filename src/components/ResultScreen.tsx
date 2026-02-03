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

  // Проверяем, есть ли у участников детализация по позициям
  const hasItems = currentBill.participants.some(p => (p.items?.length || 0) > 0);

  const totalAmount = currentBill.totalAmount;

  const getParticipantAmount = (participant: typeof currentBill.participants[0]) => {
    if (hasItems) {
      return participant.totalAmount || 0;
    }
    return currentBill.totalAmount / currentBill.participants.length;
  };

  const handleShare = async () => {
    let text = `Счёт: ${currentBill.name}\n`;
    
    if (hasItems) {
      // Детализированный вывод с позициями
      currentBill.participants.forEach(p => {
        text += `\n${p.name} — ${(p.totalAmount || 0).toFixed(2)} ₽\n`;
        if (p.items && p.items.length > 0) {
          p.items.forEach(item => {
            text += `  • ${item.name}: ${item.price.toFixed(2)} ₽\n`;
          });
        }
      });
    } else {
      // Простой вывод
      text += currentBill.participants.map(p => 
        `${p.name} — ${getParticipantAmount(p).toFixed(2)} ₽`
      ).join('\n');
    }
    
    text += `\nИтого: ${currentBill.totalAmount.toFixed(2)} ₽`;
    
    // Добавляем информацию о чеке если он есть
    if (currentBill.receiptPhoto) {
      text += '\n\n📎 Чек прикреплён';
    }
    
    // Если есть фото чека, пытаемся поделиться с файлом
    if (navigator.share && currentBill.receiptPhoto) {
      try {
        // Конвертируем base64 в blob для share
        const response = await fetch(currentBill.receiptPhoto);
        const blob = await response.blob();
        const file = new File([blob], 'receipt.jpg', { type: 'image/jpeg' });
        
        await navigator.share({
          title: currentBill.name,
          text: text,
          files: [file]
        });
        hapticFeedback('light');
        return;
      } catch (error) {
        // Если не удалось поделиться с файлом, продолжаем без него
        console.log('Share with file failed, falling back to text only');
      }
    }
    
    // Обычный share или копирование в буфер
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
            {hasItems ? '🧾 Детализация по участникам' : `По ${(totalAmount / currentBill.participants.length).toFixed(2)} ₽ с каждого`}
          </h3>
          <div className="space-y-3">
            {currentBill.participants.map((participant) => {
              const amount = getParticipantAmount(participant);
              
              return (
                <div key={participant.id}>
                  <button
                    onClick={() => copyAmount(amount)}
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
                      {amount.toFixed(2)} ₽
                    </span>
                  </button>
                  
                  {/* Показываем позиции если есть */}
                  {hasItems && participant.items && participant.items.length > 0 && (
                    <div className="mt-2 ml-4 space-y-1">
                      {participant.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between px-4 py-2 rounded-lg"
                          style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)', opacity: 0.7 }}
                        >
                          <span className="text-sm" style={{ color: 'var(--tg-theme-text-color)' }}>
                            • {item.name}
                          </span>
                          <span className="text-sm font-medium" style={{ color: 'var(--tg-theme-hint-color)' }}>
                            {item.price.toFixed(2)} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs mt-4 text-center" style={{ color: 'var(--tg-theme-hint-color)' }}>
            💡 Нажмите на карточку, чтобы скопировать сумму
          </p>
        </div>
      </div>

      {/* Фото чека если есть */}
      {currentBill.receiptPhoto && (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
          <div className="p-6">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}>
              📎 Чек
            </h3>
            <img 
              src={currentBill.receiptPhoto} 
              alt="Чек" 
              className="w-full h-auto rounded-xl"
              style={{ maxHeight: '400px', objectFit: 'contain', backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
            />
          </div>
        </div>
      )}

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
