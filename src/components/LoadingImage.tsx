import { memo } from 'react';
import {
  Image,
  ImageErrorEventData,
  ImageProps,
  NativeSyntheticEvent,
} from 'react-native';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { isEqual } from 'lodash';
import { AnimatedBox } from './Box';
import { SkeletonLoader } from './Skeleton';

export const LoadingImage = memo(
  ({
    source,
    width,
    height,
    loaderWidth = 20,
    loaderHeight = 20,
    ...props
  }: {
    width?: number;
    height?: number;
    loaderWidth?: number;
    loaderHeight?: number;
  } & ImageProps) => {
    const loadingProgress = useSharedValue(0);

    const onLoadStart = () => {
      loadingProgress.value = withTiming(0, { duration: 300 });
      props.onLoadStart?.();
    };
    const onLoadEnd = () => {
      loadingProgress.value = withTiming(1, { duration: 300 });
      props.onLoadEnd?.();
    };
    const onLoadError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
      props.onError?.(error);
    };

    const loaderStyles = useAnimatedStyle(() => ({
      opacity: interpolate(loadingProgress.value, [0, 1], [1, 0]),
    }));

    return (
      <>
        <AnimatedBox
          style={[
            {
              position: 'absolute',
              zIndex: 1,
            },
            loaderStyles,
          ]}
        >
          <SkeletonLoader width={loaderWidth} height={loaderHeight} />
        </AnimatedBox>
        <Image
          source={source}
          width={width}
          height={height}
          resizeMode={props.resizeMode}
          {...props}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onError={onLoadError}
        />
      </>
    );
  },
  (p, n) => isEqual(p, n)
);
