import { History, Action, Location } from 'history';

export const navigate = (
  history: History,
  navigationInfo: NavigationInfo,
  onNullNavigationInfo: () => void,
) => {
  if (!navigationInfo) {
    onNullNavigationInfo();
    return;
  }

  switch (navigationInfo.action) {
    case 'POP':
      history.push(navigationInfo.location);
      break;
    case 'PUSH':
      history.push(navigationInfo.location);
      break;
    case 'REPLACE':
      history.replace(navigationInfo.location);
      break;
  }

  return;
};

export type NavigationInfo = null | {
  action: Action;
  location: Location;
};
