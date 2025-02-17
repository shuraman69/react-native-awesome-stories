import { SafeAreaView } from 'react-native';
import { StoriesList } from 'react-native-awesome-stories';
import { generateStoryData } from './config';
import { Box } from './components';
import { useEffect, useState } from 'react';

export const AppEntry = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(generateStoryData(8));
  useEffect(() => {
    const newItems = generateStoryData(8);
    setData((prev) => [...prev, ...newItems]);
  }, [page]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1c1c1c' }}>
      <Box width={'100%'}>
        <StoriesList
          stories={data}
          config={{
            renderContent: () => null,
            onStoryStepIndexChange: ({ item: _, storyIndex, stepIndex }) => {
              console.log(storyIndex, stepIndex);
            },
          }}
          onStoryPress={async () => {
            await new Promise((r) => setTimeout(r, 1500));
          }}
          flatListProps={{
            onEndReached: async () => {
              await new Promise((r) =>
                setTimeout(() => {
                  setPage((prev) => prev + 1);
                  r(true);
                }, 5000)
              );
            },
          }}
        />
      </Box>
    </SafeAreaView>
  );
};
