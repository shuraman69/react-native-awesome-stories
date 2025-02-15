import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { isEqual } from 'lodash';
import { SIZE } from '../../config';
import { Box } from '../Box';
import { getStyleProps } from '../../utils';

export const TapRegion = memo(
  ({ onPress, side }: { onPress: () => void; side: 'left' | 'right' }) => {
    const containerProps = getStyleProps<typeof Box>({
      [side]: 0,
      position: 'absolute',
      width: SIZE.width / 2,
      height: '100%',
      zIndex: 11,
    });
    return (
      <Box {...containerProps}>
        <TouchableOpacity
          style={{ width: '100%', height: '100%' }}
          onPress={onPress}
        />
      </Box>
    );
  },
  (p, n) => isEqual(p, n)
);
