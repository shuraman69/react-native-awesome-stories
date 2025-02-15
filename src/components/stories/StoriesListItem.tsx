import { memo } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { isEqual } from 'lodash';
import {
  interpolateColor,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Constants } from '../../config';
import { getStyleProps } from '../../utils';
import { AnimatedBox, Box } from '../Box';
import { Text } from '../Text';
import { LoadingAnimation } from './LoadingAnimation';
import { LoadingImage } from '../LoadingImage';

export const StoryListItem = memo(
  ({
    title,
    image,
    loading,
    onPress,
  }: {
    title: string;
    image: string;
    loading: boolean;
    onPress: (event: GestureResponderEvent) => void;
  }) => {
    const containerProps = getStyleProps<typeof Box>({
      width: Constants.SLIDER_CARD_W,
      height: Constants.SLIDER_CARD_H,
      borderRadius: Constants.SPACING * 4,
      borderWidth: Constants.SPACING / 2,
      marginRight: Constants.SPACING * 2,
      borderColor: 'yellow',
      padding: Constants.SPACING,
      overflow: 'hidden',
      justifyContent: 'flex-end',
    });
    const styles = StyleSheet.create({
      image: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: Constants.SPACING * 3,
        margin: Constants.SPACING / 2,
      },
      gradient: {
        ...StyleSheet.absoluteFillObject,
        margin: Constants.SPACING / 2,
      },
    });
    const borderAnimation = useAnimatedStyle(() => {
      return {
        borderColor: withTiming(
          interpolateColor(Number(loading), [0, 1], ['yellow', 'transparent']),
          {
            duration: 500,
          }
        ),
      };
    }, [loading]);

    return (
      <AnimatedBox>
        <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
          {loading && <LoadingAnimation loading={loading} />}
          <AnimatedBox style={borderAnimation} {...containerProps}>
            {image ? (
              <LoadingImage
                style={styles.image}
                source={{ uri: image, cache: 'force-cache' }}
                loaderWidth={Constants.SLIDER_CARD_W}
                loaderHeight={Constants.SLIDER_CARD_H}
              />
            ) : (
              <></>
            )}
            {/*<LinearGradient*/}
            {/*  start={{ x: 0.5, y: 1 }}*/}
            {/*  end={{ x: 0.5, y: 0 }}*/}
            {/*  style={styles.gradient}*/}
            {/*  colors={[*/}
            {/*    theme.colors.backgroundPrimary,*/}
            {/*    theme.colors.transparent,*/}
            {/*  ]}*/}
            {/*/>*/}
            <Text
              fontWeight={'500'}
              marginBottom={Constants.SPACING}
              marginLeft={Constants.SPACING}
            >
              {title}
            </Text>
          </AnimatedBox>
        </TouchableOpacity>
      </AnimatedBox>
    );
  },
  (p, n) => {
    return isEqual(p, n);
  }
);
