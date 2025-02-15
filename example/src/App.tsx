import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppEntry } from './AppEntry';
import { StoriesProvider } from 'react-native-awesome-stories';

export default function App() {
  return (
    <GestureHandlerRootView>
      <StoriesProvider>
        <AppEntry />
      </StoriesProvider>
    </GestureHandlerRootView>
  );
}
