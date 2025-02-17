import { memo, useCallback, useMemo, useState } from 'react';
import { StoriesListProps } from '../../types';
import { Constants } from '../../config';
import { isEqual } from 'lodash';
import { FlatList, GestureResponderEvent } from 'react-native';
import { useStoriesPlayer } from '../../hooks/useStoriesPlayer';
import { StoryListItem } from './StoriesListItem';

export const StoriesList = memo(
  ({ stories, onStoryPress, config, flatListProps }: StoriesListProps) => {
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
        item: StoriesListProps['stories'][number];
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
      (item: StoriesListProps['stories'][number]) => String(item.id),
      []
    );

    return (
      <FlatList
        data={stories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={Constants.SLIDER_CARD_W + Constants.SPACING * 5}
        decelerationRate={'fast'}
        contentContainerStyle={{
          paddingHorizontal: Constants.SPACING * 5,
        }}
        {...flatListProps}
      />
    );
  },
  (p, n) => isEqual(p, n)
);
