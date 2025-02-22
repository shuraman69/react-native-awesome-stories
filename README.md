# react-native-awesome-stories

A fast and optimized library for rendering stories with smooth animations and gestures. Supports story lists and an integrated player with full customization.

## Installation

```sh
npm install react-native-awesome-stories
```

```sh
yarn add react-native-awesome-stories
```

## Peer Dependencies

This library requires the following peer dependencies to be installed in your project:

```json
{
  "react-native-gesture-handler": ">=2.10.0",
  "react-native-reanimated": ">=2.12.0",
  "react-native-svg": "*"
}
```

## Basic Usage
First, wrap your app with `StoriesProvider` and `GestureHandlerRootView`:
```tsx
// App.tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StoriesProvider } from 'react-native-awesome-stories';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoriesProvider
        theme={{
          viewedBorderColor: 'gray',
          listItemStyle: {
            borderRadius: 12,
            borderWidth: 3,
            width: 80,
            height: 80,
            borderColor: 'yellow',
          },
        }}
      >
        <YourApp />
      </StoriesProvider>
    </GestureHandlerRootView>
  );
}
```
Then use `StoriesList` component to display stories:
```tsx
// Stories.tsx
import { SafeAreaView } from 'react-native';
import { StoriesList } from 'react-native-awesome-stories';

const stories = [
  {
    id: '1',
    image: 'https://example.com/preview1.jpg',
    title: 'Story 1',
    isViewed: false,
    steps: [
      {
        id: '1-1',
        image: 'https://example.com/story1-1.jpg',
        title: 'Step 1',
        duration: 5000
      },
      {
        id: '1-2',
        image: 'https://example.com/story1-2.jpg',
        title: 'Step 2',
        duration: 3000
      }
    ]
  },
  // ... more stories
];

export function Stories() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StoriesList
        stories={stories}
        config={{
          renderContent: () => null,
          onStoryStepIndexChange: ({ storyIndex, stepIndex }) => {
            console.log('Current position:', storyIndex, stepIndex);
          },
        }}
        onStoryPress={async (story) => {
          // Handle story press, e.g. load data
          await new Promise(resolve => setTimeout(resolve, 1000));
        }}
        flatListProps={{
          onEndReached: () => {
            // Load more stories
          },
        }}
      />
    </SafeAreaView>
  );
}
```
# StoriesProvider

The `StoriesProvider` component allows you to customize the appearance of the stories list in your application using a theme configuration.

## Usage

Wrap your application with `StoriesProvider` and provide a custom theme if needed:

```tsx
<StoriesProvider theme={customTheme}>
  <YourApp />
</StoriesProvider>
```

## Props

| Prop                 | Type                                                                 | Description |
|----------------------|----------------------------------------------------------------------|-------------|
| **`borderColor`**     | `string`                                                              | Border color for story list items. |
| **`viewedBorderColor`** | `string`                                                            | Border color applied when `isViewed` is `true`. |
| **`listItemStyle`**   | `Omit<ViewStyle, 'width' \| 'height' \| 'borderRadius'> & { width: number; height: number; borderRadius?: number; }` | Styles for the story list item, including `width`, `height`, and optional `borderRadius`. |
| **`skeletonBg`**      | `string`                                                              | Background color of the skeleton loader when an image is loading. |
| **`skeletonTintColor`** | `string`                                                            | Tint color of the moving skeleton animation. |
___
## Theme Configuration Type

```ts
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
```

## Story List Data Type

The library provides a structured way to define story list items and their steps using the following types:

```ts
export type StoryListItemType<T = {}> = {
  id: string;
  image: string;
  title: string;
  isViewed?: boolean;
  steps: StoryStepType<T>[];
};

export type StoryStepType<T = {}> = {
  id: string;
  image: string;
  title: string;
  duration?: number;
} & T;
```

### Description of `StoryListItemType`
| Prop       | Type                                    | Description |
|------------|----------------------------------------|-------------|
| **`id`**    | `string`                              | Unique identifier of the story item. |
| **`image`** | `string`                              | Cover image URL of the story item. |
| **`title`** | `string`                              | Title of the story item. |
| **`isViewed`** | `boolean` (optional)                | Whether the story has been viewed. |
| **`steps`** | `StoryStepType<T>[]`                  | Array of steps that make up the story. |

### Description of `StoryStepType`
| Prop       | Type         | Description |
|------------|-------------|-------------|
| **`id`**    | `string`     | Unique identifier of the story step. |
| **`image`** | `string`     | Image URL of the story step. |
| **`title`** | `string`     | Title of the story step. |
| **`duration`** | `number` (optional) | Duration of the step in seconds. |
| **Additional Props** | `T` (generic) | Extendable properties for custom metadata. |

This type system allows you to manage and extend story data flexibly, making it easy to integrate into different use cases.
This allows for full customization of the story list's appearance, ensuring a seamless integration with your app's design.

## `StoriesList` Props

| Prop           | Type                        | Description                                                                                                                                                                                              |
|----------------|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `stories`      | `Array<StoryListItemType<T>>` | An array of `\StoryListItemType\` objects containing the data to be displayed in the story list. Each element represents a single story.                                                                 |
| `onStoryPress` | `StoryPressCallback`        | A callback function that is called when a story item is pressed. It receives the data of the story that was clicked. **You can use this to perform asynchronous operations, such as preloading images.** |
| `config`       | `StoriesConfigType<T>`      | A configuration object for the story list. It is used to customize the display of stories, such as the number of items per screen, scroll behavior, and other parameters.                                |
| `flatListProps` | `FlatList component props`  | Additional props for the `FlatList` component. All props from `FlatListProps`, except for `data`, `renderItem`, and `keyExtractor`, can be passed to customize the behavior and appearance of the list.  |

### Image prefetch example
```tsx
const stories = [
  // your stories
];

<StoriesList
  stories={stories}
  onStoryPress={async (item) => {
    const promises = item.steps.map((step) => new Promise(async (resolve) => {
      await Image.prefetch(step.image);
      resolve(true);
    }));
    await Promise.all(promises);
  }}
/>
```

## `StoriesConfigType<T>` Type

| Prop                     | Type                                                                                  | Description                                                                                                                                                                    |
|--------------------------|---------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `renderContent`          | `(item: StoryStepType<T>) => React.ReactNode`                                         | A function that renders the content for each story step. It receives a `StoryStepType` object as an argument and returns a React node to display.                              |
| `onStoryStepIndexChange` | `(props: { item: StoryStepType<T>; storyIndex: number; stepIndex: number; }) => void` | An optional callback function that is called when the story step index changes. It receives the updated story and step indices, as well as the current story step item.        |
| `preloadImagesEnabled`   | `boolean / undefined`                                                                 | An optional flag that determines whether images should be preloaded for the story steps. If enabled, images may load faster when the user reaches that part of the story. *Preloads the images of the neighboring story steps.* |


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
