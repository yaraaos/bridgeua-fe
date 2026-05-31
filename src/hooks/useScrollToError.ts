import { useRef } from 'react';
import type { ScrollView } from 'react-native';
import { spacing } from '@/src/constants/spacing';

export function useScrollToError<T extends string>() {
  const scrollRef = useRef<ScrollView>(null);
  const fieldPositions = useRef<Record<string, number>>({});

  const registerField = (key: T) => ({
    onLayout: (e: { nativeEvent: { layout: { y: number } } }) => {
      fieldPositions.current[key] = e.nativeEvent.layout.y;
    },
  });

  const scrollToFirstError = (
    orderedKeys: T[],
    errors: Partial<Record<T, string | boolean | undefined>>,
  ) => {
    const firstKey = orderedKeys.find((k) => errors[k]);
    if (firstKey !== undefined && fieldPositions.current[firstKey] !== undefined) {
      scrollRef.current?.scrollTo({
        y: Math.max(0, fieldPositions.current[firstKey] - spacing.lg),
        animated: true,
      });
    }
  };

  return { scrollRef, registerField, scrollToFirstError };
}
