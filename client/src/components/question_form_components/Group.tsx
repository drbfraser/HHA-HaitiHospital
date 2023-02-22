import { ReactNode } from 'react';
import cn from 'classnames';

type GroupProps = {
  children: ReactNode;
  isRootNode?: boolean;
};
const Group = ({ children, isRootNode }: GroupProps): JSX.Element => (
  <div className={cn({"border-start border-2": !isRootNode}, "pl-3")}>
    {children}
    <div className="border-top border-2 ml-n3" style={{width: "1rem"}}/>
  </div>
);

export default Group;
