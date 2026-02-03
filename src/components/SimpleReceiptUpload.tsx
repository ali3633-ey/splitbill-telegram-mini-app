import { useState } from 'react';
import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';

export const SimpleReceiptUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const currentBill = useBillStore((state) => state.currentBill);
  const setReceiptPhoto = useBillStore((state) => state.setReceiptPhoto);
  const { hapticFeedback } = useTelegram();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    setIsUploading(true);
    hapticFeedback('light');

    try {
      // Создаем превью
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewUrl(result);
        setReceiptPhoto(result);
        hapticFeedback('medium');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Ошибка при загрузке фото:', error);
      hapticFeedback('heavy');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setReceiptPhoto('');
    hapticFeedback('light');
  };

  const existingPhoto = currentBill?.receiptPhoto || previewUrl;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
      <div className="p-6">
        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}>
          📎 Фото чека (необязательно)
        </h3>

        {!existingPhoto ? (
          <label className="block">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            <div
              className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all active:scale-98"
              style={{
                borderColor: 'var(--tg-theme-hint-color)',
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                minHeight: '200px'
              }}
            >
              {isUploading ? (
                <>
                  <div className="text-4xl mb-3 animate-spin">⏳</div>
                  <p className="text-base" style={{ color: 'var(--tg-theme-hint-color)' }}>
                    Загрузка...
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-3">📷</div>
                  <p className="text-lg font-semibold mb-2" style={{ color: 'var(--tg-theme-text-color)' }}>
                    Прикрепить чек
                  </p>
                  <p className="text-sm text-center" style={{ color: 'var(--tg-theme-hint-color)' }}>
                    Нажмите, чтобы сделать фото или выбрать из галереи
                  </p>
                </>
              )}
            </div>
          </label>
        ) : (
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src={existingPhoto} 
                alt="Чек" 
                className="w-full h-auto rounded-xl"
                style={{ maxHeight: '400px', objectFit: 'contain', backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
              />
            </div>
            
            <button
              onClick={handleRemovePhoto}
              className="w-full py-3 px-5 rounded-xl font-semibold text-base transition-all active:scale-95"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-destructive-text-color)',
                minHeight: 'var(--tap-target-min)'
              }}
            >
              🗑️ Удалить фото
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
