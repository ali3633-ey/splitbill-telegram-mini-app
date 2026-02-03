# Fifty-Fifty - Telegram Mini App

Telegram Mini App для разделения счёта между друзьями.

## 🚀 Технологии

- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик
- **Zustand** - управление состоянием
- **Tailwind CSS** - стилизация
- **Telegram WebApp API** - интеграция с Telegram

## 📁 Структура проекта

```
src/
├── components/         # React компоненты
│   ├── TelegramProvider.tsx  # Провайдер для Telegram WebApp
│   ├── Header.tsx            # Шапка приложения
│   ├── CreateBillForm.tsx    # Форма создания счёта
│   └── BillDetails.tsx       # Детали счёта и участники
├── hooks/              # Пользовательские хуки
│   └── useTelegram.ts        # Хук для работы с Telegram WebApp API
├── store/              # Zustand store
│   └── useBillStore.ts       # Глобальное состояние счетов
├── types/              # TypeScript типы
│   └── index.ts              # Типы данных
├── App.tsx             # Главный компонент
├── main.tsx            # Точка входа
└── index.css           # Глобальные стили
```

## 🎯 Функционал MVP

- ✅ Создание счёта
- ✅ Добавление участников по имени
- ✅ Ввод общей суммы
- ✅ Автоматическое деление суммы поровну
- ✅ Отображение: кто и сколько должен
- ✅ Сохранение счётов в localStorage
- ✅ Интеграция с Telegram (определение пользователя)
- ✅ Haptic Feedback для нативного ощущения

## 🏗️ Архитектура

### Типы данных (src/types/index.ts)

```typescript
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  // ...
}

interface Participant {
  id: string;
  name: string;
  amount: number;  // сумма к оплате
}

interface Bill {
  id: string;
  name: string;
  totalAmount: number;
  participants: Participant[];
  createdAt: Date;
  createdBy?: TelegramUser;
}
```

### Zustand Store (src/store/useBillStore.ts)

**Состояние:**
- `currentBill` - текущий редактируемый счёт
- `bills` - список всех сохранённых счетов
- `telegramUser` - данные пользователя Telegram

**Действия:**
- `createBill(name)` - создание нового счёта
- `setTotalAmount(amount)` - установка общей суммы
- `addParticipant(name)` - добавление участника
- `removeParticipant(id)` - удаление участника
- `calculateSplit()` - расчёт разделения суммы
- `saveBill()` - сохранение счёта
- `loadBill(id)` - загрузка счёта
- `resetCurrentBill()` - сброс текущего счёта

### Хук useTelegram (src/hooks/useTelegram.ts)

Предоставляет:
- `tg` - объект Telegram WebApp API
- `user` - данные пользователя
- `isReady` - статус готовности
- `showAlert()` - показ алертов
- `showConfirm()` - показ подтверждений
- `hapticFeedback` - вибрация (impact, notification, selection)

**Особенности:**
- Автоматическая инициализация Telegram WebApp
- Режим разработки с тестовым пользователем
- Применение темы Telegram к приложению

### Компоненты

**TelegramProvider** - Обёртка для инициализации Telegram WebApp
- Показывает загрузку до готовности
- Устанавливает пользователя в store

**Header** - Шапка приложения
- Показывает название приложения
- Отображает данные пользователя Telegram

**CreateBillForm** - Форма создания счёта
- Ввод названия счёта
- Haptic feedback при создании

**BillDetails** - Главный компонент работы со счётом
- Ввод общей суммы
- Добавление/удаление участников
- Автоматический расчёт при изменениях
- Визуализация результатов
- Сохранение счёта

## 🚀 Запуск

### Разработка

```bash
npm install
npm run dev
```

### Сборка

```bash
npm run build
```

### Превью продакшен билда

```bash
npm run preview
```

## 🔧 Настройка для Telegram

1. Создайте бота через [@BotFather](https://t.me/botfather)
2. Получите токен бота
3. Создайте Mini App через `/newapp`
4. Укажите URL вашего приложения
5. Приложение автоматически получит данные пользователя через `window.Telegram.WebApp.initDataUnsafe`

## 📱 Тестирование

### В Telegram:
- Откройте ваше Mini App в Telegram
- Все функции будут работать с реальными данными пользователя

### Локально:
- Приложение работает в режиме разработки с тестовым пользователем
- Все функции доступны, кроме специфичных для Telegram (отправка данных боту и т.д.)

## 🎨 Кастомизация

### Tailwind CSS
Все стили используют Tailwind CSS 4.x с поддержкой темы Telegram через CSS переменные:
- `--tg-theme-bg-color`
- `--tg-theme-text-color`
- `--tg-theme-button-color`
- `--tg-theme-button-text-color`

### Расширение функционала

**Добавление новых полей:**
1. Обновите типы в `src/types/index.ts`
2. Добавьте действия в `src/store/useBillStore.ts`
3. Обновите компоненты

**Добавление новых функций Telegram:**
1. Расширьте интерфейс `TelegramWebApp` в `src/hooks/useTelegram.ts`
2. Добавьте методы в возвращаемый объект хука

## 🔐 Безопасность

⚠️ **Важно:** Текущая версия работает без бэкенда и не проверяет `initData`.
Для production версии необходимо:
1. Добавить бэкенд
2. Проверять подпись `initData` через секретный ключ бота
3. Хранить данные на сервере

## 📝 Roadmap

- [ ] Неравномерное разделение счёта
- [ ] Разделение по позициям
- [ ] История счетов
- [ ] Бэкенд и авторизация
- [ ] Шаринг счетов между пользователями
- [ ] Уведомления
- [ ] Мультивалютность
- [ ] Чаевые
- [ ] Экспорт в PDF

## 🤝 Вклад

Приветствуются любые предложения и улучшения!

## 📄 Лицензия

MIT
