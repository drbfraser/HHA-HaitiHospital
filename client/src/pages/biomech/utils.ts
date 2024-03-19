import { BiomechPriority, BiomechStatus } from './typing';

type PriorityBadgeType = {
  [key in BiomechPriority]: 'danger' | 'warning' | 'success';
};

type StatusBadgeType = {
  [key in BiomechStatus]: 'success' | 'primary' | 'secondary';
};

export const PriorityBadge: PriorityBadgeType = {
  [BiomechPriority.URGENT]: 'danger',
  [BiomechPriority.IMPORTANT]: 'warning',
  [BiomechPriority.NONURGENT]: 'success',
};

export const StatusBadge: StatusBadgeType = {
  [BiomechStatus.FIXED]: 'success',
  [BiomechStatus.INPROGRESS]: 'primary',
  [BiomechStatus.BACKLOG]: 'secondary',
};
