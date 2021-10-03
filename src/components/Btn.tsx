import {IProps, getClassesFromProps} 
  from './IProps';

interface IBtn extends IProps {
  value: string;  
}

const Btn = (props: IBtn) => {
  const classes = getClassesFromProps(props);
  
  return (
    <button className={classes}>
      {props.value}
    </button>
  )
}

export default Btn;