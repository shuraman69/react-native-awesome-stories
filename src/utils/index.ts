import type { ComponentProps, JSXElementConstructor } from 'react';

export const getStyleProps = <T extends JSXElementConstructor<any>>(
  props: ComponentProps<T>
) => props;
