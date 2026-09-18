import React from 'react';
import { BaseText, BaseTextProps } from '../ui/BaseText';

export type EazeTextProps = BaseTextProps;

/**
 * EazeText — Standard typography wrapper strictly bound to the eaze design system.
 */
export function EazeText(props: EazeTextProps) {
  return <BaseText {...props} />;
}
