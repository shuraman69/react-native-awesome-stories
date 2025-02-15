import { Dimensions, Platform } from 'react-native';
import React from 'react';
import { StoriesConfigType, StoryNode } from '../types';

export const SIZE = Dimensions.get('window');
export const IS_IOS = Platform.OS === 'ios';
export const Constants = {
  SLIDER_CARD_W: 76,
  SLIDER_CARD_H: 76,
  SPACING: 4,
};

export const StoriesContext = React.createContext<{
  opened: boolean;
  openStories: ({}: { pageX: number; pageY: number }) => void;
  prepareStories: ({}: {
    stories: any[];
    openIndex: number;
    config: StoriesConfigType;
  }) => void;
  closeStories: () => void;
  initialStoryIndex: number;
  storiesLinkedList: Record<any, StoryNode>;
  storiesLength: number;
}>({
  opened: false,
  openStories: () => {},
  closeStories: () => {},
  prepareStories: () => {},
  initialStoryIndex: 0,
  storiesLinkedList: {},
  storiesLength: 0,
});
