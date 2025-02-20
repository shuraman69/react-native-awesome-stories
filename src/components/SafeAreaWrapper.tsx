import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Box } from './Box';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SafeAreaWrapper = ({
  styles,
  children,
}: {
  styles?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) => {
  const insets = useSafeAreaInsets();
  return (
    <Box
      style={[
        {
          top: insets.top,
          bottom: insets.bottom,
          left: insets.left,
          right: insets.right,
        },
        styles,
      ]}
    >
      {children}
    </Box>
  );
};
