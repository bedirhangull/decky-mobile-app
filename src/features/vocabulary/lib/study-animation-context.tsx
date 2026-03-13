import { createContext, type FC, type PropsWithChildren, useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';

type StudyAnimationContextValue = {
  isDragging: SharedValue<boolean>;
  animatedStudyIndex: SharedValue<number>;
  currentStudyIndex: SharedValue<number>;
  prevStudyIndex: SharedValue<number>;
  isKnowPressed: SharedValue<boolean>;
  isDontKnowPressed: SharedValue<boolean>;
  isDone: SharedValue<boolean>;
  total: number;
};

const StudyAnimationContext = createContext<StudyAnimationContextValue | undefined>(undefined);

type StudyAnimationProviderProps = PropsWithChildren<{ total: number }>;

export const StudyAnimationProvider: FC<StudyAnimationProviderProps> = ({ children, total }) => {
  const isDragging = useSharedValue(false);
  const animatedStudyIndex = useSharedValue(0);
  const currentStudyIndex = useSharedValue(0);
  const prevStudyIndex = useSharedValue(0);
  const isKnowPressed = useSharedValue(false);
  const isDontKnowPressed = useSharedValue(false);
  const isDone = useSharedValue(false);

  const value: StudyAnimationContextValue = {
    isDragging,
    animatedStudyIndex,
    currentStudyIndex,
    prevStudyIndex,
    isKnowPressed,
    isDontKnowPressed,
    isDone,
    total,
  };

  return (
    <StudyAnimationContext.Provider value={value}>
      {children}
    </StudyAnimationContext.Provider>
  );
};

export function useStudyAnimation(): StudyAnimationContextValue {
  const ctx = useContext(StudyAnimationContext);
  if (ctx === undefined) {
    throw new Error('useStudyAnimation must be used within StudyAnimationProvider');
  }
  return ctx;
}
