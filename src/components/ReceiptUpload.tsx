import { useState } from 'react';
import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';
import { mockOCR, fileToBase64, validateReceiptImage, parseReceiptTotal } from '../utils/ocr';

export const ReceiptUpload = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOcrResult, setShowOcrResult] = useState(false);

  const setTotalAmount = useBillStore((state) => state.setTotalAmount);
  const { hapticFeedback } = useTelegram();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Валидация
    const validation = validateReceiptImage(file);
    if (!validation.valid) {
      setError(validation.error || 'Ошибка валидации файла');
      hapticFeedback('heavy');
      return;
    }

    setImageFile(file);

    // Создаём превью
    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      hapticFeedback('light');
    } catch (err) {
      setError('Ошибка загрузки изображения');
      hapticFeedback('heavy');
    }
  };

  const handleProcessOCR = async () => {
    if (!imageFile) return;

    setIsProcessing(true);
    setError(null);
    hapticFeedback('medium');

    try {
      // Вызываем OCR (mock или реальный API)
      const text = await mockOCR(imageFile);
      setOcrText(text);
      setShowOcrResult(true);

      // Пытаемся автоматически извлечь сумму
      const total = parseReceiptTotal(text);
      if (total) {
        setTotalAmount(total);
      }

      hapticFeedback('light');
    } catch (err) {
      setError('Ошибка распознавания текста. Попробуйте другое изображение.');
      hapticFeedback('heavy');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOcrTextChange = (text: string) => {
    setOcrText(text);
    
    // Автоматически обновляем сумму при изменении текста
    const total = parseReceiptTotal(text);
    if (total) {
      setTotalAmount(total);
    }
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
    setOcrText('');
    setShowOcrResult(false);
    setError(null);
    hapticFeedback('light');
  };

  return (
    <div className="space-y-6">
      {/* Загрузка изображения */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6">
          <h3 className="text-sm font-semibold mb-5 uppercase tracking-wide" style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}>
            📸 Загрузить чек
          </h3>

          {!imagePreview ? (
            <label className="block">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all active:scale-98"
                style={{
                  borderColor: 'var(--tg-theme-hint-color)',
                  backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div className="text-6xl mb-3">📷</div>
                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--tg-theme-text-color)' }}>
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
                  className="w-full h-auto max-h-80 object-contain"
                  style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
                />
                <button
                  onClick={handleClear}
                  className="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all active:scale-90"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                  aria-label="Удалить фото"
                >
                  ✕
                </button>
              </div>

              {/* Кнопка распознавания */}
              {!showOcrResult && (
                <button
                  onClick={handleProcessOCR}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all active:scale-95"
                  style={{
                    backgroundColor: isProcessing ? 'var(--tg-theme-hint-color)' : 'var(--tg-theme-button-color)',
                    color: 'var(--tg-theme-button-text-color)',
                    opacity: isProcessing ? 0.7 : 1,
                    minHeight: 'var(--tap-target-min)'
                  }}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Распознаём текст...
                    </span>
                  ) : (
                    '🔍 Распознать чек'
                  )}
                </button>
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
      {showOcrResult && (
        <div className="rounded-2xl overflow-hidden animate-fadeIn" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}>
                📝 Распознанный текст
              </h3>
              <button
                onClick={() => setShowOcrResult(false)}
                className="text-base font-semibold px-4 py-2 rounded-lg transition-all active:scale-95"
                style={{ color: 'var(--tg-theme-link-color)' }}
              >
                Скрыть
              </button>
            </div>

            <textarea
              value={ocrText}
              onChange={(e) => handleOcrTextChange(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 rounded-xl text-base font-mono resize-none"
              style={{
                backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                color: 'var(--tg-theme-text-color)',
                border: 'none',
                outline: 'none',
                lineHeight: '1.6'
              }}
              placeholder="Распознанный текст появится здесь..."
            />

            <p className="text-xs mt-3" style={{ color: 'var(--tg-theme-hint-color)' }}>
              💡 Вы можете отредактировать текст вручную. Сумма обновится автоматически.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
