import { FlatListProps } from 'react-native';

export type StoryPressCallback = (
  story: StoriesListProps['stories'][number],
  index: number
) => Promise<void>;

export type StoryListItemType = {
  id: string;
  image: string;
  title: string;
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
