import { memo, useCallback, useMemo, useState } from 'react';
import { ExtractStepType, StoriesListProps } from '../../types';
import { Constants } from '../../config';
import { isEqual } from 'lodash';
import { FlatList, GestureResponderEvent } from 'react-native';
import { useStoriesPlayer } from '../../hooks/useStoriesPlayer';
import { StoryListItem } from './StoriesListItem';

export const StoriesList = memo(
  <T extends any = any>({
    stories,
    onStoryPress,
    config,
    flatListProps,
  }: StoriesListProps<
    ExtractStepType<StoriesListProps['stories'][number]>
  >) => {
    const { openStories, prepareStories, themeConfig } = useStoriesPlayer();

    const [loadingIndex, setLoadingIndex] = useState<number | undefined>(
      undefined
    );

    const memoizedHandlers = useMemo(
      () =>
        stories.map((item, index) => (event: GestureResponderEvent) => {
          event.target.measure(async (_, __, ___, ____, pageX, pageY) => {
            setLoadingIndex(index);
            await onStoryPress?.(item, index);
            prepareStories({ stories, config, openIndex: index });
            setLoadingIndex(undefined);
            openStories({
              pageX,
              pageY,
            });
          });
        }),
      [stories, onStoryPress]
    );

    const renderItem = useCallback(
      ({
        index,
        item,
      }: {
        item: StoriesListProps<T>['stories'][number];
        index: number;
      }) => {
        return (
          <StoryListItem
            {...item}
            loading={index === loadingIndex}
            onPress={
              memoizedHandlers[index] as (event: GestureResponderEvent) => void
            }
            themeConfig={themeConfig}
          />
        );
      },
      [loadingIndex, memoizedHandlers]
    );

    const keyExtractor = useCallback(
      (item: StoriesListProps<T>['stories'][number]) => String(item.id),
      []
    );

    return (
      <FlatList
        data={stories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: Constants.SPACING * 5,
        }}
        {...flatListProps}
      />
    );
  },
  (p, n) => isEqual(p, n)
) as <T>(props: StoriesListProps<T>) => JSX.Element; // Важно добавить это приведение типов для правильной работы с generic
