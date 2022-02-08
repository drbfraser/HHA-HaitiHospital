import { SyntheticEvent, useEffect, useState } from 'react';

interface AllTickProps{
    tickTracker : {[rid: string] : boolean},
    notifyTable(ticked : boolean) : void,
}

function isAllTicked(tickTracker: { [rid: string]: boolean }) {
  // console.log(tickTracker)
  const values = Object.values(tickTracker);
  return !values.includes(false);
}

const AllTick = (props: AllTickProps) => {
  const [isTicked, setTicked] = useState<boolean>(isAllTicked(props.tickTracker));

  useEffect(() => {
    setTicked(isAllTicked(props.tickTracker));
  }, [props.tickTracker]);

  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        id="tick-all"
        checked={isTicked}
        onChange={(e: SyntheticEvent) => {
          const target = e.target as HTMLInputElement;
          props.notifyTable(target.checked);
        }}
      />

      <label className="form-check-label" htmlFor="tick-all"></label>
    </div>
  );
};

export default AllTick;
