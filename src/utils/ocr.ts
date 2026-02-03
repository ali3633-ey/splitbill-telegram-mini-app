/**
 * OCR для распознавания текста из изображения чека
 * 
 * Mock-версия для разработки. Можно заменить на реальный API:
 * - Google Cloud Vision API
 * - AWS Textract
 * - Azure Computer Vision
 * - Tesseract.js
 */

/**
 * Mock OCR функция для демонстрации
 * В реальном приложении заменить на вызов API
 */
export async function mockOCR(_image: File | string): Promise<string> {
  // Симуляция задержки API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Возвращаем примерный результат распознавания чека
  return `Ресторан "Вкусно"
Ул. Пушкина, д.10

Дата: 03.02.2026
Время: 19:30

Салат Цезарь       450.00
Паста Карбонара    680.00
Стейк              1200.00
Десерт             320.00
Кофе x2            300.00

---------------------------
Итого:            2950.00
Сервис (10%):      295.00
---------------------------
К оплате:         3245.00

Спасибо за визит!`;
}

/**
 * Реальная реализация с Google Cloud Vision API
 * Раскомментируйте и настройте при внедрении
 */
/*
export async function googleVisionOCR(image: File): Promise<string> {
  const apiKey = process.env.VITE_GOOGLE_VISION_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Vision API key not configured');
  }
  
  // Конвертируем файл в base64
  const base64Image = await fileToBase64(image);
  
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image.split(',')[1], // Убираем data:image prefix
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1,
              },
            ],
          },
        ],
      }),
    }
  );
  
  const data = await response.json();
  
  if (data.responses && data.responses[0].textAnnotations) {
    return data.responses[0].textAnnotations[0].description;
  }
  
  throw new Error('No text detected in image');
}
*/

/**
 * Вспомогательная функция для конвертации File в base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Парсинг распознанного текста чека для извлечения суммы
 * Ищет общую сумму по ключевым словам
 */
export function parseReceiptTotal(ocrText: string): number | null {
  // Паттерны для поиска итоговой суммы
  const patterns = [
    /(?:итого|total|к оплате|всего|сумма)[\s:]*(\d+(?:[.,]\d{2})?)/i,
    /(\d+(?:[.,]\d{2})?)\s*(?:руб|₽|rub)/i,
  ];
  
  for (const pattern of patterns) {
    const match = ocrText.match(pattern);
    if (match) {
      const amount = match[1].replace(',', '.');
      return parseFloat(amount);
    }
  }
  
  return null;
}

/**
 * Валидация изображения чека
 */
export function validateReceiptImage(file: File): { valid: boolean; error?: string } {
  // Проверка типа файла
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Поддерживаются только изображения (JPEG, PNG, WebP)',
    };
  }
  
  // Проверка размера (макс 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Размер файла не должен превышать 10MB',
    };
  }
  
  return { valid: true };
}
