import { BiomechPriority, BiomechStatus } from './typing';

export const PriorityBadge = {
  [BiomechPriority.URGENT]: 'danger',
  [BiomechPriority.IMPORTANT]: 'warning',
  [BiomechPriority.NONURGENT]: 'success',
};

export const StatusBadge = {
  [BiomechStatus.FIXED]: 'success',
  [BiomechStatus.INPROGRESS]: 'primary',
  [BiomechStatus.BACKLOG]: 'secondary',
};
