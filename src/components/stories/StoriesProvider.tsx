import { memo, PropsWithChildren, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { StoriesPlayer } from './StoriesPlayer';
import { AnimatedBox } from '../Box';
import { getStyleProps } from '../../utils';
import { useStoriesAnimations } from '../../hooks';
import { SIZE, StoriesContext, StoriesControllerContext } from '../../config';
import { PrepareStoriesCbArgs, StoriesThemeConfigType } from '../../types';

export const StoriesProvider = memo(
  ({
    children,
    theme,
  }: PropsWithChildren<{ theme: StoriesThemeConfigType }>) => {
    const {
      storiesLength,
      storiesLinkedList,
      playerOpened,
      initialStoryIndex,
      initialStoryStepIndex,
      openStories,
      prepareStories,
      closeStories,
      animatedStyle,
      overlayAnimatedStyle,
      playerConfig,
      PanGesture,
      themeConfig,
    } = useStoriesAnimations(theme);

    const contextValue = useMemo(
      () => ({
        opened: playerOpened,
        openStories,
        closeStories,
        prepareStories,
        initialStoryIndex: initialStoryIndex.current,
        initialStepIndex: initialStoryStepIndex.current,
        storiesLinkedList,
        storiesLength: storiesLength.current,
        themeConfig: themeConfig.current,
      }),
      [playerOpened]
    );

    const controllerContextValue = useMemo(
      () => ({
        isPlayerOpened: playerOpened,
        openPlayer: async (args: PrepareStoriesCbArgs) => {
          await prepareStories(args);
          openStories({ pageX: SIZE.width / 2, pageY: SIZE.height / 2 });
        },
        closePlayer: closeStories,
      }),
      [playerOpened]
    );

    const modalProps = getStyleProps<typeof AnimatedBox>({
      style: [
        {
          position: 'absolute',
          zIndex: 10,
          height: '100%',
          overflow: 'hidden',
          width: '100%',
        },
        animatedStyle,
      ],
    });

    const overlay = getStyleProps<typeof AnimatedBox>({
      style: [
        StyleSheet.absoluteFill,
        { backgroundColor: '#000' },
        overlayAnimatedStyle,
      ],
    });

    return (
      <StoriesContext.Provider value={contextValue}>
        <StoriesControllerContext.Provider value={controllerContextValue}>
          <GestureDetector gesture={PanGesture}>
            <AnimatedBox {...modalProps}>
              <AnimatedBox {...overlay} />
              {playerOpened ? (
                <StoriesPlayer {...playerConfig.current} />
              ) : (
                <></>
              )}
            </AnimatedBox>
          </GestureDetector>
          {children}
        </StoriesControllerContext.Provider>
      </StoriesContext.Provider>
    );
  }
);
