import { FlatListProps, ViewStyle } from 'react-native';

export type StoryPressCallback = (
  story: StoriesListProps['stories'][number],
  index: number
) => Promise<void>;

export type StoryListItemType = {
  id: string;
  image: string;
  title: string;
  isViewed?: boolean;
  steps: StoryStepType[];
};

export type StoriesListProps = {
  stories: StoryListItemType[];
  onStoryPress?: StoryPressCallback;
  config: StoriesConfigType;
  flatListProps?: Omit<
    FlatListProps<StoryListItemType>,
    'data' | 'renderItem' | 'keyExtractor'
  >;
};

export type StoryStepType = {
  id: string;
  image: string;
  title: string;
  duration?: number;
};

export type StoriesConfigType = {
  renderContent: (item: StoryStepType) => React.ReactNode;
  onStoryStepIndexChange?: (props: {
    item: StoryStepType;
    storyIndex: number;
    stepIndex: number;
  }) => void;
};

export type StoryNode = {
  id: string;
  image: string;
  title: string;
  steps: StoryStepType[];
  prev: {
    id: string;
    image: string;
    title: string;
    steps: StoryStepType[];
  } | null;
  next: {
    id: string;
    image: string;
    title: string;
    steps: StoryStepType[];
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
  loadingIndicatorRadius?: number;
};
