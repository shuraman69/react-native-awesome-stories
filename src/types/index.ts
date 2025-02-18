import { FlatListProps, ViewStyle } from 'react-native';

export type StoryPressCallback<T> = (
  story: StoriesListProps<T>['stories'][number],
  index: number
) => Promise<void>;

export type StoryListItemType<T = {}> = {
  id: string;
  image: string;
  title: string;
  isViewed?: boolean;
  steps: StoryStepType<T>[];
};

export type ExtractStepType<T> = T extends { steps: Array<infer S> }
  ? S extends StoryStepType<infer U>
    ? U
    : never
  : never;

export type StoriesListProps<T = any> = {
  stories: Array<StoryListItemType<T>>;
  onStoryPress?: StoryPressCallback<T>;
  config: StoriesConfigType<T>;
  flatListProps?: Omit<
    FlatListProps<StoryListItemType<T>>,
    'data' | 'renderItem' | 'keyExtractor'
  >;
};

export type StoryStepType<T = {}> = {
  id: string;
  image: string;
  title: string;
  duration?: number;
} & T;

export type StoriesConfigType<T = StoryStepType<any>> = {
  renderContent: (item: StoryStepType<T>) => React.ReactNode;
  onStoryStepIndexChange?: (props: {
    item: StoryStepType<T>;
    storyIndex: number;
    stepIndex: number;
  }) => void;
  preloadImagesEnabled?: boolean;
};

export type StoryNode<T = {}> = {
  id: string;
  image: string;
  title: string;
  steps: StoryStepType<T>[];
  prev: {
    id: string;
    image: string;
    title: string;
    steps: StoryStepType<T>[];
  } | null;
  next: {
    id: string;
    image: string;
    title: string;
    steps: StoryStepType<T>[];
  } | null;
};

export type StoriesThemeConfigType = {
  borderColor?: string;
  viewedBorderColor?: string;
  listItemStyle?: Omit<ViewStyle, 'width' | 'height' | 'borderRadius'> & {
    width: number;
    height: number;
    borderRadius?: number;
  };
  skeletonBg?: string;
  skeletonTintColor?: string;
};

export type PrepareStoriesCbArgs = {
  stories?: StoryListItemType[];
  storyIndex?: number;
  stepIndex?: number;
  config?: StoriesConfigType;
};
