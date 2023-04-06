import { BiomechPriority, BiomechStatus } from './typing';

export const setPriority = (priority: BiomechPriority): string => {
  enum BiomechBadge {
    URGENT = 'danger',
    IMPORTANT = 'warning',
    NONURGENT = 'success',
  }

  switch (priority) {
    case BiomechPriority.URGENT:
      return BiomechBadge.URGENT;
    case BiomechPriority.IMPORTANT:
      return BiomechBadge.IMPORTANT;
    case BiomechPriority.NONURGENT:
      return BiomechBadge.NONURGENT;
  }
};

export const setStatusBadgeColor = (status: BiomechStatus): string => {
  switch (status) {
    case BiomechStatus.FIXED:
      return 'success';
    case BiomechStatus.INPROGRESS:
      return 'primary';
    case BiomechStatus.BACKLOG:
      return 'secondary';
  }
};
