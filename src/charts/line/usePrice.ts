import { useDerivedValue } from 'react-native-reanimated';

import { formatPrice } from '../../utils';
import type { TFormatterFn } from '../candle/types';
import { useLineChart } from './useLineChart';

export function useLineChartPrice({
  format,
  precision = 2,
  index,
}: { format?: TFormatterFn<string>; precision?: number; index?: number } = {}) {
  const { currentIndex, data } = useLineChart();

  const float = useDerivedValue(() => {
    if (
      (typeof currentIndex.value === 'undefined' ||
        currentIndex.value === -1) &&
      index == null
    )
      return '';

    // Defensive check: ensure data exists and has items
    if (!data || !Array.isArray(data) || data.length === 0) {
      return '';
    }

    const targetIndex = Math.min(index ?? currentIndex.value, data.length - 1);
    const dataItem = data[targetIndex];

    if (!dataItem || typeof dataItem.value === 'undefined') {
      return '';
    }

    const price = dataItem.value;
    return price.toFixed(precision).toString();
  }, [currentIndex, data, precision]);
  const formatted = useDerivedValue(() => {
    let value = float.value || '';
    const formattedPrice = value ? formatPrice({ value }) : '';
    return format
      ? format({ value, formatted: formattedPrice })
      : formattedPrice;
  }, [float, format]);

  return { value: float, formatted };
}
