import React, { memo } from 'react';
import { View } from 'react-native';
import Svg, { LinearGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const SkeletonLoader = memo(
  ({ width = 300, height = 100 }: { width: number; height: number }) => {
    const translateX = useSharedValue(-width);

    React.useEffect(() => {
      translateX.value = withRepeat(
        withTiming(width, { duration: 1000 }),
        -1,
        false
      );
    }, [width]);

    const animatedProps = useAnimatedProps(() => ({
      x: translateX.value,
    }));

    return (
      <View>
        <Svg width={width} height={height}>
          <Rect width={width} height={height} fill="#2C2C2C" rx={8} />
          <AnimatedRect
            width={width / 2}
            height={height}
            fill="url(#grad)"
            animatedProps={animatedProps}
          />
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#2C2C2C" stopOpacity="1" />
            <Stop offset="50%" stopColor="#3A3A3A" stopOpacity="1" />
            <Stop offset="100%" stopColor="#2C2C2C" stopOpacity="1" />
          </LinearGradient>
        </Svg>
      </View>
    );
  }
);
