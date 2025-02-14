import { multiply } from 'react-native-awesome-stories';
import {
  Text,
  View,
  StyleSheet,
  ViewProps,
  ViewStyle,
  StyleProp,
} from 'react-native';

const result = multiply(3, 7);

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Box
        width={100}
        height={100}
        backgroundColor={'red'}
        onTouchStart={() => console.log('start')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
type BoxProps = ViewProps & { style?: StyleProp<ViewStyle> } & ViewStyle;

const Box = ({ style, children, ...rest }: BoxProps) => {
  return (
    <View {...rest} style={[rest as ViewStyle, style]}>
      {children}
    </View>
  );
};
