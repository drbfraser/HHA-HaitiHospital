import { ReactNode } from 'react';
import cn from 'classnames';

type GroupProps = {
  children: ReactNode;
  className?: string;
  hasErrors?: boolean;
  isRootNode?: boolean;
};
const Group = ({ children, className, hasErrors, isRootNode }: GroupProps): JSX.Element => (
  <div
    className={cn(
      {
        'border-start border-2': !isRootNode,
        'border-danger border-opacity-50': hasErrors,
      },
      className,
      'pl-3',
    )}
  >
    {children}
    <div
      className={cn(
        {
          'border-top border-2 ml-n3': !isRootNode,
          'border-danger border-opacity-50': hasErrors,
        }
      )}
      style={{ width: '1rem' }}
    />
  </div>
);

export default Group;
