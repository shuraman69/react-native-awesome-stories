import { Dimensions, Platform } from 'react-native';
import React from 'react';
import {
  PrepareStoriesCbArgs,
  StoriesConfigType,
  StoriesThemeConfigType,
  StoryNode,
} from '../types';

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
  prepareStories: ({}: PrepareStoriesCbArgs) => void;
  closeStories: () => void;
  initialStoryIndex: number;
  initialStepIndex: number;
  storiesLinkedList: Record<any, StoryNode>;
  storiesLength: number;
  themeConfig: StoriesThemeConfigType;
}>({
  opened: false,
  openStories: () => {},
  closeStories: () => {},
  prepareStories: () => {},
  initialStoryIndex: 0,
  initialStepIndex: 0,
  storiesLinkedList: {},
  storiesLength: 0,
  themeConfig: {},
});

export const StoriesControllerContext = React.createContext<{
  isPlayerOpened: boolean;
  openPlayer: ({}: {
    stories?: any[];
    storyIndex?: number;
    stepIndex?: number;
    config?: StoriesConfigType;
  }) => Promise<void>;
  closePlayer: () => void;
}>({
  isPlayerOpened: false,
  openPlayer: async () => {},
  closePlayer: () => {},
});
