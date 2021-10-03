export interface IProps {
  classes?: string;
}

export function getClassesFromProps
  (props: IProps) : string
{
  return (props === undefined)? 
    '' as string : props.classes as string;
}
