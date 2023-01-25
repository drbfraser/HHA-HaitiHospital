import { BiomechPriority } from './typing';

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
