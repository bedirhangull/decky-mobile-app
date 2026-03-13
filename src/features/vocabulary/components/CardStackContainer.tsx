import { type FC, type PropsWithChildren, memo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useStudyAnimation } from '../lib/study-animation-context';
import {
  useCardAnimation,
  type CardStackGesture,
} from '../lib/card-animation-provider';

type CardStackContainerProps = PropsWithChildren<{
  index: number;
  gesture?: CardStackGesture;
}>;

const CardStackContainer: FC<CardStackContainerProps> = ({ children, index, gesture }) => {
  const { width, height } = useWindowDimensions();
  const { animatedStudyIndex, currentStudyIndex } = useStudyAnimation();
  const { panX, panY, absoluteYAnchor, panDistance } = useCardAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    const current = currentStudyIndex.get();
    const isTop = index === current;
    const isNext = index === current + 1;
    const isNextNext = index === current + 2;
    const isPrev = index === current - 1;

    const inputRange = [index - 2, index - 1, index, index + 1, index + 2];
    const sign = absoluteYAnchor.get() > height / 2 ? -1 : 1;

    const top = interpolate(
      animatedStudyIndex.get(),
      inputRange,
      [0, width * 0.07, 0, 0, 0],
      Extrapolation.CLAMP
    );

    const rotate = interpolate(
      panX.get(),
      [-panDistance, 0, panDistance],
      [sign * 4, 0, -sign * 4],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      animatedStudyIndex.get(),
      inputRange,
      [0.95, 0.95, 1, 1, 1],
      Extrapolation.CLAMP
    );

    const translateX = isTop ? panX.get() : 0;
    const translateY = isTop ? panY.get() : 0;
    const zIndex = isTop ? 100 : 50 - index;

    return {
      top,
      opacity: isTop || isNext || isNextNext || isPrev ? 1 : 0,
      zIndex,
      transform: [
        { translateX },
        { translateY },
        { rotate: `${rotate}deg` },
        { scale },
      ],
    };
  });

  const content =
    gesture != null ? (
      <GestureDetector gesture={gesture}>
        <View collapsable={false} style={[StyleSheet.absoluteFill, { flex: 1 }]}>
          {children}
        </View>
      </GestureDetector>
    ) : (
      children
    );

  return (
    <Animated.View
      key={index}
      style={[styles.container, rContainerStyle]}
      pointerEvents="box-none"
    >
      {content}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    zIndex: 50,
  },
});

export default memo(CardStackContainer);
