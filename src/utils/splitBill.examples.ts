/**
 * Примеры и тесты для функции splitBill
 */

import { splitBill, validateSplit, type Participant } from './splitBill';

// Пример 1: Простое деление
console.log('=== Пример 1: Делим 100 рублей на 3 человека ===');
const participants1: Participant[] = [
  { id: '1', name: 'Алиса' },
  { id: '2', name: 'Боб' },
  { id: '3', name: 'Чарли' }
];
const result1 = splitBill(participants1, 100, 'equal');
console.log(result1);
console.log('Сумма сходится:', validateSplit(result1, 100));
console.log('Итого:', result1.reduce((sum, s) => sum + s.amount, 0).toFixed(2), 'руб.\n');

// Пример 2: Неделимая сумма
console.log('=== Пример 2: Делим 1000 рублей на 3 человека ===');
const participants2: Participant[] = [
  { id: '1', name: 'Иван' },
  { id: '2', name: 'Мария' },
  { id: '3', name: 'Петр' }
];
const result2 = splitBill(participants2, 1000, 'equal');
console.log(result2);
console.log('Сумма сходится:', validateSplit(result2, 1000));
console.log('Итого:', result2.reduce((sum, s) => sum + s.amount, 0).toFixed(2), 'руб.\n');

// Пример 3: Деление на 7 человек
console.log('=== Пример 3: Делим 1234.56 рублей на 7 человек ===');
const participants3: Participant[] = [
  { id: '1', name: 'Участник 1' },
  { id: '2', name: 'Участник 2' },
  { id: '3', name: 'Участник 3' },
  { id: '4', name: 'Участник 4' },
  { id: '5', name: 'Участник 5' },
  { id: '6', name: 'Участник 6' },
  { id: '7', name: 'Участник 7' }
];
const result3 = splitBill(participants3, 1234.56, 'equal');
console.log(result3);
console.log('Сумма сходится:', validateSplit(result3, 1234.56));
console.log('Итого:', result3.reduce((sum, s) => sum + s.amount, 0).toFixed(2), 'руб.\n');

// Пример 4: Маленькая сумма
console.log('=== Пример 4: Делим 10 рублей на 3 человека ===');
const participants4: Participant[] = [
  { id: '1', name: 'A' },
  { id: '2', name: 'B' },
  { id: '3', name: 'C' }
];
const result4 = splitBill(participants4, 10, 'equal');
console.log(result4);
console.log('Сумма сходится:', validateSplit(result4, 10));
console.log('Итого:', result4.reduce((sum, s) => sum + s.amount, 0).toFixed(2), 'руб.\n');

// Пример 5: Один участник
console.log('=== Пример 5: Один участник ===');
const participants5: Participant[] = [
  { id: '1', name: 'Единственный' }
];
const result5 = splitBill(participants5, 99.99, 'equal');
console.log(result5);
console.log('Сумма сходится:', validateSplit(result5, 99.99));
console.log('Итого:', result5.reduce((sum, s) => sum + s.amount, 0).toFixed(2), 'руб.\n');

// Экспорт для использования в других местах
export const examples = {
  simple: result1,
  notDivisible: result2,
  sevenPeople: result3,
  smallAmount: result4,
  singlePerson: result5
};
