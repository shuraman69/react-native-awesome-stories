import {
  memo,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';
import { AnimatedBox, Box } from '../Box';
import { Row } from '../Row';
import { Constants, IS_IOS, SIZE } from '../../config';
import { StoriesConfigType, StoryStepType } from '../../types';
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  FadeIn,
  interpolate,
  runOnJS,
  runOnUI,
  ScrollHandlerProcessed,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/hook/commonTypes';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { AnimatedScrollView } from 'react-native-reanimated/lib/typescript/component/ScrollView';
import { isEqual } from 'lodash';
import { useStoriesPlayer } from '../../hooks/useStoriesPlayer';
import { usePreloadStoriesStepsImages } from '../../hooks/usePreloadStoriesStepsImages';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const StoriesPlayer = ({
  renderContent,
  onStoryStepIndexChange,
  preloadImagesEnabled,
}: StoriesConfigType) => {
  const {
    closeStories,
    initialStoryIndex,
    initialStepIndex,
    storiesLinkedList,
    storiesLength,
  } = useStoriesPlayer();
  const scrollRef = useRef<AnimatedScrollView | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);

  const current = storiesLinkedList[currentStoryIndex];
  const prev = storiesLinkedList[currentStoryIndex]?.prev;
  const next = storiesLinkedList[currentStoryIndex]?.next;
  const currentStoryStepsLength = current?.steps?.length || 0;
  const isPaused = useSharedValue(0);
  const scrollTo = useCallback(
    (offset: number, animated?: boolean) =>
      scrollRef.current?.scrollTo({ x: offset, animated: animated ?? true }),
    []
  );

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) =>
      Math.min(prev + 1, currentStoryStepsLength - 1)
    );
  }, [currentStoryIndex]);
  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, [currentStoryIndex]);

  const nextStory = useCallback(() => {
    const nextIndex = currentStoryIndex + 1;
    if (nextIndex === storiesLength) {
      closeStories();
      return;
    }
    scrollTo(SIZE.width * nextIndex);
  }, [currentStoryIndex]);
  const prevStory = useCallback(() => {
    scrollTo(SIZE.width * (currentStoryIndex - 1));
  }, [currentStoryIndex]);

  const onLeftTapRegionPress = currentStepIndex === 0 ? prevStory : prevStep;
  const onRightTapRegionPress =
    currentStepIndex === currentStoryStepsLength - 1 ? nextStory : nextStep;

  const scrollOffset = useSharedValue(SIZE.width * initialStoryIndex);
  const lastScrollOffset = useSharedValue<number | null>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isPaused.value = 1;
    },
    onMomentumBegin: () => {
      isPaused.value = 0;
    },
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      lastScrollOffset.value = event.contentOffset.x;
    },
  });

  const renderItem = useCallback(
    (item: { id: string; steps: StoryStepType[] }, index: number) => {
      const isStoryActive = currentStoryIndex === index;
      let resultStepIndex = isStoryActive ? currentStepIndex : 0;
      return (
        <Item
          steps={item.steps}
          currentStepIndex={resultStepIndex}
          scrollOffset={scrollOffset}
          renderContent={renderContent}
          index={index}
          active={isStoryActive}
          isPaused={isPaused}
          key={item.id}
          onProgressEnd={onRightTapRegionPress}
        />
      );
    },
    [currentStepIndex, currentStoryIndex]
  );

  useEffect(() => {
    // scroll to current story offset on layout
    scrollTo(scrollOffset.get(), false);
    lastScrollOffset.value = SIZE.width * initialStoryIndex;

    runOnUI(() => {
      scrollOffset.addListener(1, (value) => {
        if (value % SIZE.width === 0 && value !== lastScrollOffset.value) {
          const newStoryIndex = value / SIZE.width;
          runOnJS(setCurrentStoryIndex)(newStoryIndex);
          runOnJS(setCurrentStepIndex)(0); // TODO: add set last story step index on prev story triggered
        }
      });
    })();
    return () => {
      runOnUI((listenerId: number) => scrollOffset.removeListener(listenerId))(
        1
      );
    };
  }, []);

  useEffect(() => {
    if (current) {
      onStoryStepIndexChange?.({
        item: current,
        storyIndex: currentStoryIndex,
        stepIndex: currentStepIndex,
      });
    }
  }, [currentStepIndex, currentStoryIndex]);

  usePreloadStoriesStepsImages(current, preloadImagesEnabled);
  return (
    <GestureDetector
      gesture={Gesture.Simultaneous(
        Gesture.Tap().onEnd((event) => {
          if (event.x < SIZE.width / 2) {
            runOnJS(onLeftTapRegionPress)();
          } else {
            runOnJS(onRightTapRegionPress)();
          }
        }),
        Gesture.LongPress()
          .minDuration(150)
          .onStart(() => {
            isPaused.value = 1;
          })
          .onEnd(() => {
            isPaused.value = 0;
          })
      )}
    >
      <Box flex={1}>
        {prev && renderItem(prev, currentStoryIndex - 1)}
        {current && renderItem(current, currentStoryIndex)}
        {next && renderItem(next, currentStoryIndex + 1)}
        <MemoizedScroll
          itemsCount={storiesLength}
          scrollRef={scrollRef}
          scrollHandler={scrollHandler}
        />
      </Box>
    </GestureDetector>
  );
};

const MemoizedScroll = memo(
  ({
    itemsCount,
    scrollRef,
    scrollHandler,
  }: {
    itemsCount: number;
    scrollRef: RefObject<AnimatedScrollView>;
    scrollHandler: ScrollHandlerProcessed;
  }) => (
    <Animated.ScrollView
      ref={scrollRef}
      style={StyleSheet.absoluteFillObject}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      pagingEnabled
      contentContainerStyle={{ width: SIZE.width * itemsCount }}
      onScroll={scrollHandler}
      decelerationRate={'fast'}
      horizontal
    />
  ),
  (p, n) => p.itemsCount === n.itemsCount
);

const { width } = SIZE;
const perspective = width;
const angle = Math.atan(perspective / (width / 1.5));
const ratio = IS_IOS ? 2 : 1.2;

const Item = memo(
  ({
    steps,
    scrollOffset,
    index,
    currentStepIndex,
    renderContent,
    active,
    isPaused,
    onProgressEnd,
  }: {
    steps: StoryStepType[];
    scrollOffset: SharedValue<number>;
    index: number;
    currentStepIndex: number;
    renderContent: StoriesConfigType['renderContent'];
    active: boolean;
    isPaused: SharedValue<number>;
    onProgressEnd: () => void;
  }) => {
    const progressAnimation = useSharedValue(0);
    const lastProgress = useSharedValue(0);

    const item = steps[currentStepIndex];
    const image = steps[currentStepIndex]?.image || '';
    const storyDuration = item?.duration || 5000;

    const animatedStyles = useAnimatedStyle(() => {
      const offset = index * width;
      const inputRange = [offset - width, offset + width];
      const translateX = interpolate(
        scrollOffset.value,
        inputRange,
        [width / ratio, -width / ratio],
        Extrapolation.CLAMP
      );

      const rotateY = interpolate(
        scrollOffset.value,
        inputRange,
        [angle, -angle],
        Extrapolation.CLAMP
      );

      const parsed = rotateY;
      const alpha = Math.abs(parsed);
      const gamma = angle - alpha;
      const beta = Math.PI - alpha - gamma;
      const w = width / 2 - ((width / 2) * Math.sin(gamma)) / Math.sin(beta);
      const translateX2 = parsed > 0 ? w : -w;

      return {
        transform: [
          { perspective },
          { translateX },
          { rotateY: `${rotateY}rad` },
          { translateX: translateX2 },
        ],
      } as DefaultStyle;
    });
    const progressStyles = useAnimatedStyle(
      () =>
        ({
          width: `${progressAnimation.value}%`,
        }) as DefaultStyle
    );

    const renderedProgressBars = useMemo(
      () =>
        steps.map((_, index) => {
          const isActive = currentStepIndex === index && active;
          return (
            <ProgressBarItem
              key={_.id}
              index={index}
              active={isActive}
              progressStyles={progressStyles}
            />
          );
        }),
      [active, currentStepIndex]
    );

    useLayoutEffect(() => {
      if (active) {
        progressAnimation.value = 0;
        progressAnimation.value = withDelay(
          150,
          withTiming(100, {
            duration: storyDuration,
            easing: Easing.linear,
          })
        );
      }
    }, [active, item]);
    useDerivedValue(() => {
      if (isPaused.value) {
        lastProgress.value = progressAnimation.value;
        cancelAnimation(progressAnimation);
      } else if (lastProgress.value !== 0) {
        progressAnimation.value = withTiming(100, {
          duration: (1 - lastProgress.value / 100) * storyDuration,
          easing: Easing.linear,
        });
      }
    }, []);

    useEffect(() => {
      lastProgress.value = 0;
      if (active) {
        runOnUI(() => {
          progressAnimation.addListener(1, (value) => {
            if (value === 100) {
              runOnJS(onProgressEnd)();
            }
          });
        })();
      }
    }, [currentStepIndex]);

    const safeAreaInsets = useSafeAreaInsets();

    return (
      <AnimatedBox
        style={[
          {
            flex: 1,
            backgroundColor: 'transparent',
            width: SIZE.width,
          },
          StyleSheet.absoluteFill,
          animatedStyles,
        ]}
      >
        <AnimatedBox
          style={{
            flex: 1,
            overflow: 'hidden',
            borderRadius: Constants.SPACING * 4,
          }}
        >
          <Row
            position={'absolute'}
            zIndex={100}
            gap={Constants.SPACING}
            paddingHorizontal={Constants.SPACING}
            paddingTop={Math.max(safeAreaInsets.top, Constants.SPACING * 3)}
          >
            {renderedProgressBars}
          </Row>
          {!!image && (
            <Animated.Image
              entering={FadeIn.delay(180)}
              style={StyleSheet.absoluteFill}
              source={{ uri: image, cache: 'force-cache' }}
            />
          )}
          <Box
            flex={1}
            justifyContent={'flex-end'}
            paddingBottom={Constants.SPACING * 6}
          >
            {renderContent(item as StoryStepType)}
          </Box>
        </AnimatedBox>
      </AnimatedBox>
    );
  },
  (p, n) => isEqual(p, n)
);

const ProgressBarItem = memo(
  ({
    index,
    active,
    progressStyles,
  }: {
    index: number;
    active: boolean;
    progressStyles: DefaultStyle;
  }) => {
    return (
      <Box key={index} flex={1} height={2} backgroundColor={'gray'}>
        <AnimatedBox
          style={[
            {
              flex: 1,
              height: 2,
              position: 'absolute',
              backgroundColor: '#fff',
              maxWidth: active ? '100%' : 0,
            },
            progressStyles,
          ]}
        />
      </Box>
    );
  }
);
