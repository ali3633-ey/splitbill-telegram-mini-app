import { useState } from 'react';
import { useBillStore } from '../store/useBillStore';
import { useTelegram } from '../hooks/useTelegram';

export const CreateBillForm = () => {
  const [billName, setBillName] = useState('');
  const createBill = useBillStore((state) => state.createBill);
  const { hapticFeedback } = useTelegram();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (billName.trim()) {
      createBill(billName);
      hapticFeedback('light');
      setBillName('');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn px-4">
      {/* Приветствие */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--tg-theme-text-color)' }}>
            Fifty-Fifty
          </h1>
          <p className="text-lg" style={{ color: 'var(--tg-theme-hint-color)' }}>
            Раздели счет с друзьями
          </p>
        </div>
      </div>

      {/* Форма создания счёта */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--tg-theme-section-bg-color)' }}>
        <form onSubmit={handleSubmit} className="p-8">
          <label 
            htmlFor="billName" 
            className="block text-sm font-semibold mb-6 uppercase tracking-wide" 
            style={{ color: 'var(--tg-theme-hint-color)', fontSize: '13px' }}
          >
            Название счёта
          </label>
          <input
            type="text"
            id="billName"
            value={billName}
            onChange={(e) => setBillName(e.target.value)}
            placeholder="Например: Ужин в ресторане"
            autoFocus
            className="w-full px-5 py-4 rounded-xl text-lg font-medium outline-2 outline-offset-2 outline-blue-500/50 hover:outline-blue-500/70 focus:outline-blue-500"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color)',
              color: 'var(--tg-theme-text-color)',
              border: 'none',
            //   outline: 'none',
              minHeight: 'var(--tap-target-min)'
            }}
          />
          
          <button
            type="submit"
            disabled={!billName.trim()}
            className="w-full py-4 px-6 rounded-xl font-semibold text-lg mt-8 transition-all active:scale-95 hover:shadow-md hover:shadow-blue-500/50"
            style={{
              backgroundColor: billName.trim() ? 'var(--tg-theme-button-color)' : 'var(--tg-theme-hint-color)',
              color: 'var(--tg-theme-button-text-color)',
              opacity: billName.trim() ? 1 : 0.5,
              minHeight: 'var(--tap-target-min)',
            //   boxShadow: billName.trim() ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
            }}
          >
            Создать счёт
          </button>
        </form>
      </div>
    </div>
  );
};
