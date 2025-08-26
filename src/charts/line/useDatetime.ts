import { useDerivedValue } from 'react-native-reanimated';

import { formatDatetime } from '../../utils';
import type { TFormatterFn } from '../candle/types';
import { useLineChart } from './useLineChart';

export function useLineChartDatetime({
  format,
  locale,
  options,
  id
}: {
  format?: TFormatterFn<number>;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  id?:string
} = {}) {
  const { currentIndex, data } = useLineChart(id);

  const timestamp = useDerivedValue(() => {
    if (typeof currentIndex.value === 'undefined' || currentIndex.value === -1)
      return '';

    // Defensive check: ensure data exists and has valid item at current index
    if (!data || !Array.isArray(data) || currentIndex.value >= data.length) {
      return '';
    }

    const dataItem = data[currentIndex.value];
    if (!dataItem || typeof dataItem.timestamp === 'undefined') {
      return '';
    }

    return dataItem.timestamp;
  }, [currentIndex, data]);

  const timestampString = useDerivedValue(() => {
    if (timestamp.value === '') return '';
    return timestamp.value.toString();
  }, [timestamp]);

  const formatted = useDerivedValue(() => {
    const formattedDatetime = timestamp.value
      ? formatDatetime({
          value: timestamp.value,
          locale,
          options,
        })
      : '';
    return format
      ? format({ value: timestamp.value || -1, formatted: formattedDatetime })
      : formattedDatetime;
  }, [format, locale, options, timestamp]);

  return { value: timestampString, formatted };
}
