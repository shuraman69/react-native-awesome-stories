import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppEntry } from './AppEntry';
import { StoriesProvider } from 'react-native-awesome-stories';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <StoriesProvider
          theme={{
            viewedBorderColor: 'gray',
            listItemStyle: {
              borderRadius: 12,
              borderWidth: 3,
              width: 80,
              height: 80,
              borderColor: 'yellow',
              paddingBottom: 0,
            },
          }}
        >
          <AppEntry />
        </StoriesProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
