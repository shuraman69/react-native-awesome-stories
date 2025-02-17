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
import { StoriesThemeConfigType } from '../../types';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const LoadingAnimation = memo(
  ({
    loading,
    themeConfig,
  }: {
    loading: boolean;
    themeConfig: StoriesThemeConfigType;
  }) => {
    const progress = useSharedValue(0); // Для отслеживания прогресса анимации
    const WIDTH = themeConfig.listItemStyle?.width || Constants.SLIDER_CARD_W;
    const HEIGHT = themeConfig.listItemStyle?.height || Constants.SLIDER_CARD_H;
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
          height={HEIGHT + 2}
          width={WIDTH + 4}
          viewBox={`0 0 ${WIDTH + 1} ${HEIGHT}`}
        >
          <AnimatedRect
            x="0"
            y="1"
            width={WIDTH - 3}
            height={HEIGHT - 5}
            rx={themeConfig.listItemStyle?.borderRadius}
            stroke={themeConfig.listItemStyle?.borderColor}
            strokeWidth={themeConfig.listItemStyle?.borderWidth}
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
