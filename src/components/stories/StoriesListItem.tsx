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
import { StoriesThemeConfigType } from '../../types';

export const StoryListItem = memo(
  ({
    title,
    image,
    loading,
    onPress,
    themeConfig,
  }: {
    title: string;
    image: string;
    loading: boolean;
    onPress: (event: GestureResponderEvent) => void;
    themeConfig: StoriesThemeConfigType;
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
      ...themeConfig.listItemStyle,
    });
    const styles = StyleSheet.create({
      image: {
        ...StyleSheet.absoluteFillObject,
        borderRadius:
          ((themeConfig.listItemStyle?.borderRadius as number) || 4) - 4 ||
          Constants.SPACING * 3,
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
          interpolateColor(
            Number(loading),
            [0, 1],
            [
              (themeConfig.listItemStyle?.borderColor as string) || 'red',
              'transparent',
            ]
          ),
          {
            duration: 500,
          }
        ),
      };
    }, [loading]);

    return (
      <AnimatedBox>
        <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
          {loading && (
            <LoadingAnimation loading={loading} themeConfig={themeConfig} />
          )}
          <AnimatedBox style={borderAnimation} {...containerProps}>
            {image ? (
              <LoadingImage
                style={styles.image}
                source={{ uri: image, cache: 'force-cache' }}
                loaderWidth={
                  themeConfig.listItemStyle?.width || Constants.SLIDER_CARD_W
                }
                loaderHeight={
                  themeConfig.listItemStyle?.height || Constants.SLIDER_CARD_H
                }
              />
            ) : (
              <></>
            )}
            <Text
              color={'#fff'}
              fontWeight={'500'}
              marginBottom={Constants.SPACING}
              marginLeft={Constants.SPACING}
              shadowOpacity={1}
              shadowColor={'#000'}
              shadowOffset={{ width: 0, height: 2 }}
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
