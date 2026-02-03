import { useBillStore } from '../store/useBillStore';

export const Header = () => {
  const telegramUser = useBillStore((state) => state.telegramUser);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Fifty-Fifty</h1>
            <p className="text-sm text-gray-500">Разделение счёта между друзьями</p>
          </div>
          {telegramUser && (
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {telegramUser.first_name} {telegramUser.last_name}
              </p>
              {telegramUser.username && (
                <p className="text-xs text-gray-500">@{telegramUser.username}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
