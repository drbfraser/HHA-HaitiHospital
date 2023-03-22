import { History, Action, Location } from 'history';
export const navigation = (
  history: History<unknown>,
  navigationInfo: NavigationInfo,
  defaultCallback: () => void,
) => {
  if (!navigationInfo) {
    defaultCallback();
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
