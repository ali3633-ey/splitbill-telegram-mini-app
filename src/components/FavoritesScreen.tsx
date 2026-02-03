import { useState } from 'react';
import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';

type TabType = 'add' | 'list';

export const FavoritesScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [placeName, setPlaceName] = useState('');
  const [placeAddress, setPlaceAddress] = useState('');
  const [placeRating, setPlaceRating] = useState<number>(5);
  const [placeNotes, setPlaceNotes] = useState('');

  const favoritePlaces = useBillStore((state) => state.favoritePlaces);
  const addFavoritePlace = useBillStore((state) => state.addFavoritePlace);
  const removeFavoritePlace = useBillStore((state) => state.removeFavoritePlace);
  const { hapticFeedback, showConfirm } = useTelegram();

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (placeName.trim()) {
      addFavoritePlace({
        name: placeName.trim(),
        address: placeAddress.trim() || undefined,
        rating: placeRating,
        notes: placeNotes.trim() || undefined,
      });
      setPlaceName('');
      setPlaceAddress('');
      setPlaceRating(5);
      setPlaceNotes('');
      setActiveTab('list');
      hapticFeedback('medium');
    }
  };

  const handleRemovePlace = (id: string, name: string) => {
    showConfirm?.(`Удалить "${name}" из избранного?`, (confirmed: boolean) => {
      if (confirmed) {
        removeFavoritePlace(id);
        hapticFeedback('medium');
      }
    });
  };

  const handleSelectOnMap = () => {
    // Открываем Яндекс.Карты для выбора места
    const yandexMapsUrl = 'https://yandex.ru/maps/';
    
    // Пытаемся получить текущую геолокацию
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Открываем карту с текущей позицией
          const url = `${yandexMapsUrl}?ll=${longitude},${latitude}&z=16`;
          window.open(url, '_blank');
          hapticFeedback('light');
        },
        () => {
          // Если не удалось получить геолокацию, просто открываем карту
          window.open(yandexMapsUrl, '_blank');
          hapticFeedback('light');
        }
      );
    } else {
      window.open(yandexMapsUrl, '_blank');
      hapticFeedback('light');
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange?.(star)}
            disabled={!interactive}
            className={interactive ? 'transition-all active:scale-110' : ''}
            style={{ fontSize: '24px' }}
          >
            {star <= rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn px-4 pb-24">
      {/* Заголовок */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-6 text-center">
          <div className="text-5xl mb-3">⭐</div>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--tg-theme-text-color)' }}>
            Избранное
          </h2>
          <p className="text-base mt-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
            Места, которые вам понравились
          </p>
        </div>
      </div>

      {/* Переключатель табов */}
      <div 
        className="rounded-2xl overflow-hidden p-2 flex gap-2"
        style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}
      >
        <button
          onClick={() => {
            setActiveTab('list');
            hapticFeedback('light');
          }}
          className="flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all active:scale-95"
          style={{
            backgroundColor: activeTab === 'list' ? 'var(--tg-theme-button-color)' : 'transparent',
            color: activeTab === 'list' ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-text-color)',
            minHeight: 'var(--tap-target-min)'
          }}
        >
          📍 Добавленные
        </button>
        <button
          onClick={() => {
            setActiveTab('add');
            hapticFeedback('light');
          }}
          className="flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all active:scale-95"
          style={{
            backgroundColor: activeTab === 'add' ? 'var(--tg-theme-button-color)' : 'transparent',
            color: activeTab === 'add' ? 'var(--tg-theme-button-text-color)' : 'var(--tg-theme-text-color)',
            minHeight: 'var(--tap-target-min)'
          }}
        >
          ➕ Добавить место
        </button>
      </div>

      {/* Вкладка: Добавить место */}
      {activeTab === 'add' && (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
          <form onSubmit={handleAddPlace} className="p-6 space-y-4">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--tg-theme-text-color)' }}>
              Новое место
            </h3>

            {/* Название места */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
                Название *
              </label>
              <input
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Название заведения"
                autoFocus
                className="w-full px-5 py-4 rounded-xl text-lg"
                style={{
                  backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  border: 'none',
                  outline: 'none',
                  minHeight: 'var(--tap-target-min)'
                }}
              />
            </div>

            {/* Адрес */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
                Адрес
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={placeAddress}
                  onChange={(e) => setPlaceAddress(e.target.value)}
                  placeholder="Улица, дом"
                  className="w-full px-5 py-4 rounded-xl text-lg"
                  style={{
                    backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                    color: 'var(--tg-theme-text-color)',
                    border: 'none',
                    outline: 'none',
                    minHeight: 'var(--tap-target-min)'
                  }}
                />
                <button
                  type="button"
                  onClick={handleSelectOnMap}
                  className="w-full py-3 px-5 rounded-xl font-medium text-base transition-all active:scale-95"
                  style={{
                    backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                    color: 'var(--tg-theme-link-color)',
                    border: `2px dashed var(--tg-theme-link-color)`,
                    minHeight: 'var(--tap-target-min)'
                  }}
                >
                  🗺️ Указать на карте
                </button>
              </div>
            </div>

            {/* Оценка */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
                Оценка
              </label>
              {renderStars(placeRating, true, setPlaceRating)}
            </div>

            {/* Заметки */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
                Заметки
              </label>
              <textarea
                value={placeNotes}
                onChange={(e) => setPlaceNotes(e.target.value)}
                placeholder="Что запомнилось..."
                rows={3}
                className="w-full px-5 py-4 rounded-xl text-lg resize-none"
                style={{
                  backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  border: 'none',
                  outline: 'none'
                }}
              />
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPlaceName('');
                  setPlaceAddress('');
                  setPlaceRating(5);
                  setPlaceNotes('');
                  setActiveTab('list');
                  hapticFeedback('light');
                }}
                className="flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all active:scale-95"
                style={{
                  backgroundColor: 'var(--tg-theme-secondary-bg-color)',
                  color: 'var(--tg-theme-text-color)',
                  minHeight: 'var(--tap-target-min)'
                }}
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!placeName.trim()}
                className="flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all active:scale-95"
                style={{
                  backgroundColor: placeName.trim() ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)',
                  color: 'var(--tg-theme-button-text-color)',
                  opacity: placeName.trim() ? 1 : 0.5,
                  minHeight: 'var(--tap-target-min)'
                }}
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Вкладка: Список добавленных мест */}
      {activeTab === 'list' && (
        <>
          {/* Список избранных мест */}
          {favoritePlaces.length > 0 ? (
        <div className="space-y-3">
          {favoritePlaces.map((place) => (
            <div
              key={place.id}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--tg-theme-text-color)' }}>
                      {place.name}
                    </h3>
                    {place.address && (
                      <p className="text-sm mb-2" style={{ color: 'var(--tg-theme-hint-color)' }}>
                        📍 {place.address}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemovePlace(place.id, place.name)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold transition-all active:scale-90"
                    style={{
                      color: 'var(--tg-theme-destructive-text-color)',
                      backgroundColor: 'var(--tg-theme-secondary-bg-color)'
                    }}
                    aria-label="Удалить место"
                  >
                    ✕
                  </button>
                </div>

                {/* Оценка */}
                {place.rating && renderStars(place.rating)}

                {/* Заметки */}
                {place.notes && (
                  <div
                    className="mt-3 p-4 rounded-xl"
                    style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}
                  >
                    <p className="text-sm" style={{ color: 'var(--tg-theme-text-color)' }}>
                      {place.notes}
                    </p>
                  </div>
                )}

                {/* Дата добавления */}
                <p className="text-xs mt-3" style={{ color: 'var(--tg-theme-hint-color)' }}>
                  Добавлено {new Date(place.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16" style={{ color: 'var(--tg-theme-hint-color)' }}>
          <div className="text-7xl mb-4">📍</div>
          <p className="text-lg">Пока нет избранных мест</p>
          <p className="text-sm mt-2">Добавьте места, которые вам понравились</p>
        </div>
      )}
        </>
      )}
    </div>
  );
};
