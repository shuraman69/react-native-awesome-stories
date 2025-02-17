import { useEffect } from 'react';
import { StoryNode } from '../types';
import { Image } from 'react-native';

export const usePreloadStoriesStepsImages = (
  item?: StoryNode,
  enabled?: boolean
) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const preloadImages = async () => {
      if (!item) {
        return;
      }
      for (const stepImage of item.steps) {
        const cacheExists = await Image.queryCache?.([stepImage.image]).catch(
          () =>
            console.error(
              'Error while querying cache; image url: ',
              stepImage.image
            )
        );
        if (!cacheExists?.[stepImage.image]) {
          await Image.prefetch(stepImage.image).catch(() => {
            console.error(
              'Error while preloading step image; image url: ',
              stepImage.image
            );
          });
        }
      }
    };
    preloadImages();
  }, [item]);
};
