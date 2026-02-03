/**
 * Разделение счёта между участниками
 */

export interface Participant {
  id: string;
  name: string;
}

export interface ParticipantShare {
  name: string;
  amount: number;
}

export type SplitMode = 'equal';

/**
 * Разделяет счёт между участниками поровну
 * 
 * @param participants - массив участников
 * @param totalAmount - общая сумма для разделения
 * @param mode - режим деления (пока только "equal")
 * @returns массив с именем участника и его долей
 * 
 * @example
 * ```ts
 * const participants = [
 *   { id: '1', name: 'Алиса' },
 *   { id: '2', name: 'Боб' },
 *   { id: '3', name: 'Чарли' }
 * ];
 * 
 * const result = splitBill(participants, 100, 'equal');
 * // result = [
 * //   { name: 'Алиса', amount: 33.33 },
 * //   { name: 'Боб', amount: 33.33 },
 * //   { name: 'Чарли', amount: 33.34 }  // последний получает остаток
 * // ]
 * ```
 */
export function splitBill(
  participants: Participant[],
  totalAmount: number,
  mode: SplitMode = 'equal'
): ParticipantShare[] {
  // Валидация входных данных
  if (!participants || participants.length === 0) {
    return [];
  }

  if (totalAmount < 0) {
    throw new Error('Сумма не может быть отрицательной');
  }

  if (totalAmount === 0) {
    return participants.map(p => ({ name: p.name, amount: 0 }));
  }

  // Пока поддерживаем только равное разделение
  if (mode === 'equal') {
    return splitEqually(participants, totalAmount);
  }

  throw new Error(`Неподдерживаемый режим деления: ${mode}`);
}

/**
 * Равное разделение счёта между участниками
 * Округляет каждую долю до 2 знаков, последний участник получает остаток
 */
function splitEqually(
  participants: Participant[],
  totalAmount: number
): ParticipantShare[] {
  const count = participants.length;
  
  // Базовая сумма на человека (округление вниз)
  const baseAmount = Math.floor((totalAmount / count) * 100) / 100;
  
  // Вычисляем сумму после распределения базовой доли всем участникам
  const distributedAmount = baseAmount * count;
  
  // Остаток, который нужно добавить последнему участнику
  const remainder = Math.round((totalAmount - distributedAmount) * 100) / 100;
  
  // Создаём результат
  const result: ParticipantShare[] = participants.map((participant, index) => {
    const isLast = index === count - 1;
    const amount = isLast ? baseAmount + remainder : baseAmount;
    
    return {
      name: participant.name,
      amount: Math.round(amount * 100) / 100, // Гарантируем 2 знака
    };
  });

  // Проверка: сумма должна сойтись
  const totalDistributed = result.reduce((sum, share) => sum + share.amount, 0);
  const diff = Math.abs(totalDistributed - totalAmount);
  
  if (diff > 0.01) {
    console.warn(
      `Предупреждение: расхождение в ${diff.toFixed(2)} руб. ` +
      `(распределено: ${totalDistributed.toFixed(2)}, ожидалось: ${totalAmount.toFixed(2)})`
    );
  }

  return result;
}

/**
 * Проверяет, что сумма долей участников равна общей сумме
 */
export function validateSplit(
  shares: ParticipantShare[],
  totalAmount: number
): boolean {
  const sum = shares.reduce((acc, share) => acc + share.amount, 0);
  const diff = Math.abs(sum - totalAmount);
  return diff < 0.01; // Погрешность в 1 копейку допустима
}
