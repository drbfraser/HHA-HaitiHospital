import { ComponentPropsWithoutRef, useState } from 'react';

const HoverableTableHead = (props: ComponentPropsWithoutRef<'th'>) => {
  const [bgColor, setBgColor] = useState<string>(undefined);

  return (
    <th
      {...props}
      onPointerEnter={() => setBgColor('rgba(0, 0, 0, 0.075)')}
      onPointerLeave={() => setBgColor(undefined)}
      style={{
        backgroundColor: bgColor,
        cursor: 'pointer',
      }}
    >
      {props.children}
    </th>
  );
};

export default HoverableTableHead;
