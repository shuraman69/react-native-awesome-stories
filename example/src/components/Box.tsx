import { View, ViewProps, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

type BoxProps = ViewProps & ViewStyle;

export const Box = ({ style, children, ...rest }: BoxProps) => {
  return (
    <View {...rest} style={[rest as ViewStyle, style]}>
      {children}
    </View>
  );
};

export const AnimatedBox = Animated.createAnimatedComponent(View);
