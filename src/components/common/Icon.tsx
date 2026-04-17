
import { memo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colors } from '../../theme';

type IconName =
  | 'heart-outline'
  | 'heart-filled'
  | 'comment'
  | 'more'
  | 'back'
  | 'send'
  | 'lock'
  | 'close';

const MAP: Record<IconName, React.ComponentProps<typeof Ionicons>['name']> = {
  'heart-outline': 'heart-outline',
  'heart-filled': 'heart',
  comment: 'chatbubble-outline',
  more: 'ellipsis-horizontal',
  back: 'chevron-back',
  send: 'send',
  lock: 'lock-closed',
  close: 'close',
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

function IconBase({ name, size = 20, color = colors.textPrimary }: IconProps) {
  return <Ionicons name={MAP[name]} size={size} color={color} />;
}

export const Icon = memo(IconBase);
