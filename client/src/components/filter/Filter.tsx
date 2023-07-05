import { Button, Form, InputGroup } from 'react-bootstrap';

import { DateRangeFilter } from './DateRangeFilter';
import { DayRange } from 'react-modern-calendar-datepicker';
import { NumberFilter } from './NumberFilter';
import { Row } from '@tanstack/react-table';
import { StringFilter } from './StringFilter';

export type FilterValue = string | number | DayRange;

export interface FilterProps {
  placeholder: string;
  setFilterFn?: (fn: (row: Row<any>, columnId: string, value: FilterValue) => boolean) => void;
  setFilterValue: (value: FilterValue) => void;
  allowFilterFnChange?: boolean;
  filterValue: FilterValue;
  inputProps?: any;
  type: 'string' | 'number' | 'date';
}

const Filter = (props: FilterProps) => {
  return (
    <>
      {props.type === 'string' && <StringFilter {...props} />}
      {props.type === 'number' && <NumberFilter {...props} />}
      {props.type === 'date' && <DateRangeFilter {...props} />}
    </>
  );
};

export default Filter;
