import {
  StyleProp,
  Text as RNText,
  TextProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

type BoxProps = TextProps & { style?: StyleProp<TextStyle> } & TextStyle;

export const Text = ({ style, children, ...rest }: BoxProps) => {
  return (
    <RNText {...rest} style={[rest as ViewStyle, style]}>
      {children}
    </RNText>
  );
};
