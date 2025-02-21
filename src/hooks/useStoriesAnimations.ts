import { useCallback, useRef, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import { SIZE } from '../config';
import {
  PrepareStoriesCbArgs,
  StoriesConfigType,
  StoriesThemeConfigType,
  StoryNode,
  StoryStepType,
} from '../types';

const EASING = Easing.bezier(0.29, 0.47, 0.22, 0.99);
const defaultRenderContent = () => null;

export const useStoriesAnimations = (theme: StoriesThemeConfigType) => {
  const [playerOpened, setPlayerOpened] = useState(false);
  const [storiesLinkedList, setStoriesLinkedList] = useState<
    Record<any, StoryNode>
  >({});

  const storiesLength = useRef(0);
  const initialStoryIndex = useRef(0);
  const initialStoryStepIndex = useRef(0);
  const playerConfig = useRef<StoriesConfigType>({
    renderContent: defaultRenderContent,
    preloadImagesEnabled: false,
  });
  const themeConfig = useRef<StoriesThemeConfigType>(theme);

  async function generateLinkedObject(
    array: {
      id: string;
      image: string;
      title: string;
      steps: StoryStepType[];
    }[]
  ) {
    await new Promise((resolve) => {
      const linkedObject: Record<string, StoryNode> = {};

      array.forEach((item, index) => {
        linkedObject[index] = {
          ...item,
          prev: index > 0 ? (array[index - 1] as StoryNode) : null,
          next:
            index < array.length - 1 ? (array[index + 1] as StoryNode) : null,
        };
      });
      setStoriesLinkedList(linkedObject);
      resolve(true);
    });
  }

  const onOpenXY = useSharedValue({ pageX: 0, pageY: 0 });
  const scale = useSharedValue(0.5);
  const translateY = useSharedValue(0);

  const prepareStories = useCallback(
    async ({
      stories = [],
      storyIndex = 0,
      stepIndex = 0,
      config,
    }: PrepareStoriesCbArgs) => {
      initialStoryIndex.current = storyIndex;
      initialStoryStepIndex.current = stepIndex;
      if (config) {
        playerConfig.current = config;
      }
      if (stories.length > 0) {
        storiesLength.current = stories.length;
      }
      if (stories.length > 0) {
        await generateLinkedObject(stories);
      }
    },
    []
  );

  const openAnimationProgress = useSharedValue(0);

  const openStories = ({ pageX, pageY }: { pageX: number; pageY: number }) => {
    setPlayerOpened(true);
    const duration = 420;
    onOpenXY.value = {
      pageX: pageX + (themeConfig.current.listItemStyle?.width || 0) / 2,
      pageY,
    };
    openAnimationProgress.value = withTiming(100, {
      easing: EASING,
      duration,
    });
  };
  const closeStories = useCallback(() => {
    openAnimationProgress.value = withTiming(
      0,
      {
        easing: EASING,
        duration: 350,
      },
      () => {
        runOnJS(setPlayerOpened)(false);
      }
    );
    translateY.value = withTiming(0, {
      duration: 350,
      easing: EASING,
    });
  }, []);

  const PanGesture = Gesture.Pan()
    .onChange((event) => {
      translateY.value = Math.max(event.changeY + translateY.value, 0);
      scale.value = 1;
    })
    .onFinalize((event) => {
      translateY.value = withDecay({
        velocity: event.velocityY,
        rubberBandEffect: true,
        clamp: [0, SIZE.height / 2],
      });
      if (event.velocityY > 1600) {
        return runOnJS(closeStories)();
      }
      if (event.absoluteY < SIZE.height * 0.8) {
        return (translateY.value = withTiming(0, {
          easing: EASING,
        }));
      }
      if (event.absoluteY >= SIZE.height * 0.8) {
        return runOnJS(closeStories)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        openAnimationProgress.value,
        [0, 20, 100],
        [0, 50, SIZE.width]
      ),
      maxHeight: interpolate(
        openAnimationProgress.value,
        [0, 100],
        [0, SIZE.height]
      ),
      top: interpolate(
        openAnimationProgress.value,
        [0, 60, 100],
        [onOpenXY.value.pageY, SIZE.height / 3, 0]
      ),
      left: interpolate(
        openAnimationProgress.value,
        [0, 60, 100],
        [onOpenXY.value.pageX, SIZE.width / 4, 0]
      ),
      opacity: interpolate(
        openAnimationProgress.value,
        [0, 5, 80, 100],
        [0, 0.1, 0.5, 1]
      ),
      borderRadius: 24,
      transform: [
        { translateY: translateY.value },
        {
          scale: interpolate(
            translateY.value,
            [0, SIZE.height / 2],
            [1, 0.7],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, SIZE.height / 2], [1, 0]),
  }));

  return {
    storiesLength,
    storiesLinkedList,
    initialStoryIndex,
    initialStoryStepIndex,
    playerOpened,
    animatedStyle,
    overlayAnimatedStyle,
    openStories,
    closeStories,
    prepareStories,
    playerConfig,
    PanGesture,
    themeConfig,
  };
};
