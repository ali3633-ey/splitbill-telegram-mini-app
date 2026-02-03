import { useState } from 'react';
import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';
import { mockOCR, fileToBase64, validateReceiptImage, parseReceiptTotal } from '../utils/ocr';

export const OCRScreen = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedAmount, setExtractedAmount] = useState<number | null>(null);

  const setTotalAmount = useBillStore((state) => state.setTotalAmount);
  const setScreen = useBillStore((state) => state.setScreen);
  const createBill = useBillStore((state) => state.createBill);
  const { hapticFeedback } = useTelegram();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const validation = validateReceiptImage(file);
    if (!validation.valid) {
      setError(validation.error || 'Ошибка валидации файла');
      hapticFeedback('heavy');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      hapticFeedback('light');
      
      // Автоматически запускаем OCR
      await processOCR(file);
    } catch (err) {
      setError('Ошибка загрузки изображения');
      hapticFeedback('heavy');
    }
  };

  const processOCR = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    hapticFeedback('medium');

    try {
      const text = await mockOCR(file);
      setOcrText(text);

      const total = parseReceiptTotal(text);
      if (total) {
        setExtractedAmount(total);
      }

      hapticFeedback('light');
    } catch (err) {
      setError('Ошибка распознавания текста. Попробуйте другое изображение.');
      hapticFeedback('heavy');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseAmount = () => {
    if (extractedAmount) {
      createBill('Новый счёт по чеку');
      setTotalAmount(extractedAmount);
      setScreen('add-participants');
      hapticFeedback('medium');
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setOcrText('');
    setExtractedAmount(null);
    setError(null);
    hapticFeedback('light');
  };

  return (
    <div className="space-y-6 animate-fadeIn px-4 pb-24">
      {/* Заголовок */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6 text-center">
          <div className="text-6xl mb-4">📸</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--tg-theme-text-color)' }}>
            Загрузить чек
          </h2>
          <p className="text-base" style={{ color: 'var(--tg-theme-hint-color)' }}>
            Сфотографируйте чек, и мы извлечем сумму
          </p>
        </div>
      </div>

      {/* Загрузка изображения */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6">
          {!imagePreview ? (
            <label className="block">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all active:scale-98"
                style={{
                  borderColor: 'var(--tg-theme-hint-color)',
                  backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div className="text-7xl mb-4">📷</div>
                <p className="text-xl font-semibold mb-2" style={{ color: 'var(--tg-theme-text-color)' }}>
                  Выбрать фото чека
                </p>
                <p className="text-sm" style={{ color: 'var(--tg-theme-hint-color)' }}>
                  JPEG, PNG, WebP (до 10MB)
                </p>
              </div>
            </label>
          ) : (
            <div>
              {/* Превью изображения */}
              <div className="relative rounded-xl overflow-hidden mb-4">
                <img
                  src={imagePreview}
                  alt="Чек"
                  className="w-full h-auto max-h-96 object-contain"
                  style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
                />
                <button
                  onClick={handleClear}
                  className="absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-2xl transition-all active:scale-90"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                  aria-label="Удалить фото"
                >
                  ✕
                </button>
              </div>

              {/* Статус обработки */}
              {isProcessing && (
                <div className="p-5 rounded-xl text-center" style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}>
                  <span className="animate-spin text-4xl inline-block mb-3">⏳</span>
                  <p className="text-lg font-medium" style={{ color: 'var(--tg-theme-text-color)' }}>
                    Распознаём текст...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ошибка */}
          {error && (
            <div
              className="mt-4 p-4 rounded-xl text-base font-medium"
              style={{
                backgroundColor: 'rgba(255, 69, 58, 0.15)',
                color: 'var(--tg-theme-destructive-text-color)',
              }}
            >
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      {/* Результат OCR */}
      {ocrText && !isProcessing && (
        <div className="rounded-2xl overflow-hidden animate-fadeIn" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
          <div className="p-6">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}>
              📝 Распознанный текст
            </h3>

            <textarea
              value={ocrText}
              readOnly
              rows={8}
              className="w-full px-4 py-3 rounded-xl text-sm font-mono resize-none mb-4"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                border: 'none',
                outline: 'none',
                lineHeight: '1.6'
              }}
            />

            {extractedAmount && (
              <div className="p-5 rounded-xl mb-4" style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}>
                <p className="text-sm mb-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
                  Извлечённая сумма:
                </p>
                <p className="text-4xl font-bold" style={{ color: 'var(--tg-theme-button-color)' }}>
                  {extractedAmount.toFixed(2)} ₽
                </p>
              </div>
            )}

            <button
              onClick={handleUseAmount}
              disabled={!extractedAmount}
              className="w-full py-5 px-6 rounded-2xl font-bold text-xl transition-all active:scale-95"
              style={{
                backgroundColor: extractedAmount ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)',
                color: 'var(--tg-theme-button-text-color)',
                opacity: extractedAmount ? 1 : 0.5,
                minHeight: 'var(--tap-target-min)',
                boxShadow: extractedAmount ? '0 4px 16px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              Использовать сумму
            </button>

            <p className="text-xs mt-3 text-center" style={{ color: 'var(--tg-theme-hint-color)' }}>
              💡 Проверьте сумму перед продолжением
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
