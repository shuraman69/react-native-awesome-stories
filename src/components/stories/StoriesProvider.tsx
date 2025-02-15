import { PropsWithChildren, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { StoriesPlayer } from './StoriesPlayer';
import { AnimatedBox } from '../Box';
import { getStyleProps } from '../../utils';
import { useStoriesAnimations } from '../../hooks';
import { StoriesContext } from '../../config';

const defaultRenderContent = () => null;

export const StoriesProvider = ({ children }: PropsWithChildren) => {
  const {
    storiesLength,
    storiesLinkedList,
    playerOpened,
    initialStoryIndex,
    openStories,
    prepareStories,
    closeStories,
    animatedStyle,
    overlayAnimatedStyle,
    playerConfig,
    PanGesture,
  } = useStoriesAnimations();

  const contextValue = useMemo(
    () => ({
      opened: playerOpened,
      openStories,
      closeStories,
      prepareStories,
      initialStoryIndex: initialStoryIndex.current,
      storiesLinkedList,
      storiesLength: storiesLength.current,
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
      <GestureDetector gesture={PanGesture}>
        <AnimatedBox {...modalProps}>
          <AnimatedBox {...overlay} />
          {playerOpened ? (
            <StoriesPlayer
              renderContent={
                playerConfig.current.renderContent || defaultRenderContent
              }
            />
          ) : (
            <></>
          )}
        </AnimatedBox>
      </GestureDetector>
      {children}
    </StoriesContext.Provider>
  );
};
