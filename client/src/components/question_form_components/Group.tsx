import { ReactNode } from 'react';
import cn from 'classnames';

type GroupProps = {
  children: ReactNode;
  hasErrors?: boolean;
  isRootNode?: boolean;
};
const Group = ({ children, hasErrors, isRootNode }: GroupProps): JSX.Element => (
  <div
    className={cn(
      {
        'border-start border-2': !isRootNode,
        'border-danger border-opacity-50': hasErrors,
        'mb-3': !isRootNode,
      },
      'pl-3',
    )}
  >
    {children}
    <div
      className={cn({
        'border-top border-2 ml-n3': !isRootNode,
        'border-danger border-opacity-50': hasErrors,
      })}
      style={{ width: '1rem' }}
    />
  </div>
);

export default Group;
