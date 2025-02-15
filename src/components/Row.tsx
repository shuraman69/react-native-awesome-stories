import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

type BoxProps = ViewProps & { style?: StyleProp<ViewStyle> } & ViewStyle;

export const Row = ({ style, children, ...rest }: BoxProps) => {
  return (
    <View
      {...rest}
      style={[rest as ViewStyle, style, { flexDirection: 'row' }]}
    >
      {children}
    </View>
  );
};
