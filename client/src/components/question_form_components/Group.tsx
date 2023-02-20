import { ReactNode } from 'react';

type GroupProps = {
  children: ReactNode;
};
const Group = ({ children }: GroupProps): JSX.Element => <div className="pl-3">{children}</div>;

export default Group;
