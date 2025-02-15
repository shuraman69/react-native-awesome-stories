import { useCallback, useRef, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { SIZE } from '../config';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/hook/commonTypes';
import { StoriesConfigType, StoryNode, StoryStepType } from '../types';

const EASING = Easing.bezier(0.29, 0.47, 0.22, 0.99);

export const useStoriesAnimations = () => {
  const [playerOpened, setPlayerOpened] = useState(false);
  const storiesLength = useRef(0);
  const [storiesLinkedList, setStoriesLinkedList] = useState<
    Record<any, StoryNode>
  >({});
  const initialStoryIndex = useRef(0);
  const playerConfig = useRef<Partial<StoriesConfigType>>({});

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

  const onOpenXY = useRef({ pageX: 0, pageY: 0 });
  const width = useSharedValue(0);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const translateY = useSharedValue(0);

  const prepareStories = useCallback(
    async ({
      stories,
      openIndex,
      config,
    }: {
      stories: any[];
      openIndex: number;
      config: StoriesConfigType;
    }) => {
      playerConfig.current = config;
      storiesLength.current = stories.length;
      initialStoryIndex.current = openIndex;
      await generateLinkedObject(stories);
    },
    []
  );
  const openStories = ({ pageX, pageY }: { pageX: number; pageY: number }) => {
    setPlayerOpened(true);
    const duration = 300;
    const delayY = pageX >= SIZE.width / 2 - 50 ? 100 : 50;
    const delayX = pageX >= SIZE.width / 2 - 50 ? 100 : 75;
    onOpenXY.current = { pageX, pageY };
    width.value = withTiming(SIZE.width);
    x.value = pageX > SIZE.width * 0.9 ? pageX : pageX * 1.1;
    y.value = pageY;
    y.value = withDelay(
      delayY,
      withTiming(0, {
        easing: EASING,
        duration,
      })
    );

    x.value = withDelay(
      delayX,
      withTiming(0, {
        easing: EASING,
        duration,
      })
    );
  };
  const closeStories = useCallback(() => {
    translateY.value = withTiming(0, {
      easing: EASING,
    });
    y.value = withTiming(onOpenXY.current.pageY, {
      easing: EASING,
    });
    x.value = withTiming(onOpenXY.current.pageX + 35, {
      easing: EASING,
    });
    width.value = withTiming(
      0,
      {
        easing: EASING,
      },
      () => {
        runOnJS(setPlayerOpened)(false);
      }
    );
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

  const animatedStyle = useAnimatedStyle(
    () =>
      ({
        width: width.value,
        maxHeight: interpolate(width.value, [0, SIZE.width], [0, SIZE.height]),
        top: y.value,
        left: x.value,
        opacity: interpolate(width.value, [0, 10, SIZE.width], [0, 0, 1]),
        borderRadius: interpolate(
          width.value,
          [0, SIZE.width * 1.2, SIZE.width],
          [24, 24, 0]
        ),
        transform: [
          { translateY: translateY.value },
          {
            scale: interpolate(
              translateY.value,
              [0, SIZE.height / 2],
              [1, 0.7]
            ),
          },
        ],
      }) as DefaultStyle
  );
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, SIZE.height / 2], [1, 0]),
  }));
  return {
    storiesLength,
    storiesLinkedList,
    initialStoryIndex,
    playerOpened,
    animatedStyle,
    overlayAnimatedStyle,
    openStories,
    closeStories,
    prepareStories,
    playerConfig,
    PanGesture,
  };
};
