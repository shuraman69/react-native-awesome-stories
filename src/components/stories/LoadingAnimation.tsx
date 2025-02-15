import { memo, useEffect } from 'react';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';
import { Constants } from '../../config';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const LoadingAnimation = memo(
  ({ loading }: { loading: boolean }) => {
    const progress = useSharedValue(0); // Для отслеживания прогресса анимации
    useEffect(() => {
      if (loading) {
        progress.value = withRepeat(
          withTiming(175, {
            duration: 2000,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
          }),
          -1,
          false
        );
      }
    }, [loading]);

    // Анимированный стиль для вращения
    const animatedProps = useAnimatedProps(() => {
      return {
        strokeDashoffset: -progress.value,
      };
    });
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut}
        style={[{ position: 'absolute', zIndex: 1000 }]}
      >
        <Svg
          height={Constants.SLIDER_CARD_H + 2}
          width={Constants.SLIDER_CARD_W + 4}
          viewBox={`0 0 ${Constants.SLIDER_CARD_W} ${Constants.SLIDER_CARD_H}`}
        >
          <AnimatedRect
            x="0"
            y="1"
            width={Constants.SLIDER_CARD_W - 3}
            height={Constants.SLIDER_CARD_H - 5}
            rx="12"
            stroke={'yellow'}
            strokeWidth="2"
            strokeDasharray="20,15"
            fill="none"
            animatedProps={animatedProps}
          />
        </Svg>
      </Animated.View>
    );
  },
  (p, n) => p.loading === n.loading
);
