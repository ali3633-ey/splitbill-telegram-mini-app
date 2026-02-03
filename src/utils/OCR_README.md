# OCR для распознавания чеков

Модуль для загрузки и автоматического распознавания текста из изображений чеков.

## 🎯 Функционал

✅ **Загрузка изображений** - поддержка JPEG, PNG, WebP  
✅ **Превью изображения** - отображение загруженного чека  
✅ **OCR распознавание** - извлечение текста из изображения  
✅ **Автоматический парсинг суммы** - определение итоговой суммы  
✅ **Ручное редактирование** - корректировка распознанного текста  
✅ **Валидация** - проверка типа и размера файла

## 📁 Файлы

- `src/utils/ocr.ts` - утилиты для OCR
- `src/components/ReceiptUpload.tsx` - компонент загрузки

## 🔧 Текущая реализация

### Mock OCR (для разработки)

```typescript
import { mockOCR } from './utils/ocr';

const text = await mockOCR(imageFile);
// Возвращает демо-текст чека
```

### Парсинг суммы

```typescript
import { parseReceiptTotal } from './utils/ocr';

const total = parseReceiptTotal(ocrText);
// Извлекает число из текста: "Итого: 3245.00" → 3245.00
```

### Валидация изображения

```typescript
import { validateReceiptImage } from './utils/ocr';

const validation = validateReceiptImage(file);
if (!validation.valid) {
  console.error(validation.error);
}
```

## 🚀 Интеграция реального OCR API

### Вариант 1: Google Cloud Vision API

**Шаги:**
1. Получите API ключ в [Google Cloud Console](https://console.cloud.google.com/)
2. Добавьте в `.env`:
   ```
   VITE_GOOGLE_VISION_API_KEY=your_api_key_here
   ```
3. Раскомментируйте функцию `googleVisionOCR` в `src/utils/ocr.ts`
4. Замените в `ReceiptUpload.tsx`:
   ```typescript
   // Было:
   const text = await mockOCR(imageFile);
   
   // Стало:
   const text = await googleVisionOCR(imageFile);
   ```

**Преимущества:**
- Высокая точность распознавания
- Поддержка многих языков
- Облачное решение

**Стоимость:** $1.50 за 1000 запросов

### Вариант 2: Tesseract.js (локально)

**Установка:**
```bash
npm install tesseract.js
```

**Использование:**
```typescript
import { createWorker } from 'tesseract.js';

async function tesseractOCR(image: File): Promise<string> {
  const worker = await createWorker('rus');
  const { data: { text } } = await worker.recognize(image);
  await worker.terminate();
  return text;
}
```

**Преимущества:**
- Работает локально (без интернета)
- Бесплатно
- Приватность данных

**Недостатки:**
- Медленнее облачных решений
- Может потребоваться больше размера бандла

### Вариант 3: Azure Computer Vision

**Код:**
```typescript
async function azureOCR(image: File): Promise<string> {
  const endpoint = process.env.VITE_AZURE_CV_ENDPOINT;
  const apiKey = process.env.VITE_AZURE_CV_KEY;
  
  const formData = new FormData();
  formData.append('file', image);
  
  const response = await fetch(`${endpoint}/vision/v3.2/read/analyze`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey!,
    },
    body: formData,
  });
  
  // Получение результата (асинхронная операция)
  const operationLocation = response.headers.get('Operation-Location');
  
  // Ожидание завершения
  let result;
  while (!result) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const resultResponse = await fetch(operationLocation!, {
      headers: { 'Ocp-Apim-Subscription-Key': apiKey! },
    });
    const data = await resultResponse.json();
    if (data.status === 'succeeded') {
      result = data.analyzeResult.readResults
        .map((page: any) => page.lines.map((line: any) => line.text).join('\n'))
        .join('\n');
    }
  }
  
  return result;
}
```

### Вариант 4: AWS Textract

```typescript
import { TextractClient, AnalyzeDocumentCommand } from '@aws-sdk/client-textract';

async function awsTextractOCR(image: File): Promise<string> {
  const client = new TextractClient({
    region: process.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY!,
    },
  });
  
  const imageBuffer = await image.arrayBuffer();
  
  const command = new AnalyzeDocumentCommand({
    Document: {
      Bytes: new Uint8Array(imageBuffer),
    },
    FeatureTypes: ['TABLES', 'FORMS'],
  });
  
  const response = await client.send(command);
  
  return response.Blocks
    ?.filter(block => block.BlockType === 'LINE')
    .map(block => block.Text)
    .join('\n') || '';
}
```

## 📝 Улучшение парсинга

Для более точного извлечения данных можно использовать регулярные выражения:

```typescript
export function parseReceiptAdvanced(ocrText: string) {
  return {
    // Дата
    date: ocrText.match(/(?:дата|date)[\s:]*(\d{2}\.\d{2}\.\d{4})/i)?.[1],
    
    // Итоговая сумма
    total: parseReceiptTotal(ocrText),
    
    // Позиции меню
    items: Array.from(
      ocrText.matchAll(/([А-Яа-яA-Za-z\s]+)\s+(\d+(?:[.,]\d{2})?)/g)
    ).map(match => ({
      name: match[1].trim(),
      price: parseFloat(match[2].replace(',', '.')),
    })),
    
    // Чаевые/сервис
    service: ocrText.match(/(?:сервис|service|чаевые)[\s:]*(\d+(?:[.,]\d{2})?)/i)?.[1],
  };
}
```

## 🎨 UI компонент

Компонент `ReceiptUpload` уже интегрирован в `BillDetails` и включает:

- Drag & drop зону для загрузки
- Превью изображения
- Кнопку распознавания
- Текстовое поле с результатом (редактируемое)
- Автоматическое обновление суммы при редактировании
- Индикатор загрузки
- Обработка ошибок

## 🔐 Безопасность

⚠️ **Важно при использовании реальных API:**

1. **Никогда не храните API ключи в коде**
   ```typescript
   // ❌ ПЛОХО
   const apiKey = 'sk-1234567890abcdef';
   
   // ✅ ХОРОШО
   const apiKey = process.env.VITE_API_KEY;
   ```

2. **Используйте прокси-сервер**
   - API ключи не должны быть доступны в браузере
   - Делайте запросы через ваш backend

3. **Ограничьте использование API**
   - Rate limiting
   - Квоты на пользователя
   - Валидация размера файлов

## 📊 Метрики и мониторинг

```typescript
// Добавьте логирование для отслеживания использования
export async function ocrWithMetrics(image: File) {
  const startTime = Date.now();
  
  try {
    const result = await mockOCR(image); // или реальный API
    
    // Логирование успеха
    console.log({
      type: 'ocr_success',
      duration: Date.now() - startTime,
      fileSize: image.size,
    });
    
    return result;
  } catch (error) {
    // Логирование ошибки
    console.error({
      type: 'ocr_error',
      duration: Date.now() - startTime,
      error: error.message,
    });
    
    throw error;
  }
}
```

## 🧪 Тестирование

Для тестирования используйте реальные фото чеков или создайте тестовые изображения с текстом.

**Тестовые кейсы:**
- ✅ Чёткое фото в хорошем освещении
- ✅ Фото под углом
- ✅ Размытое фото
- ✅ Чек с разными форматами дат
- ✅ Чек с несколькими итоговыми суммами
- ✅ Чек на другом языке

## 🚧 TODO / Roadmap

- [ ] Поддержка PDF чеков
- [ ] Распознавание структуры (позиции, цены)
- [ ] История загруженных чеков
- [ ] Кэширование результатов OCR
- [ ] Офлайн режим (сохранение для распознавания позже)
- [ ] Поддержка QR-кодов на чеках
- [ ] Экспорт в Excel/CSV
