import { EnumFilter, EnumOption } from './EnumFilter';

import { Button } from 'react-bootstrap';
import { DateRangeFilter } from './DateRangeFilter';
import { DayRange } from 'react-modern-calendar-datepicker';
import { NumberFilter } from './NumberFilter';
import { Row } from '@tanstack/react-table';
import { StringFilter } from './StringFilter';

export type FilterValue = string | number | string[] | DayRange;

export const enum FilterType {
  STRING,
  NUMBER,
  DATE,
  ENUM,
}

export const FILTER_DEFAULT_VALUE = {
  STRING: '',
  NUMBER: 0,
  DATE: { from: null, to: null },
  ENUM: [],
};

interface ClearFilterButtonProps {
  setFilterValue: (value: FilterValue) => void;
  filterValue: FilterValue;
  initialValue?: FilterValue;
}

export const ClearFilterButton = ({
  setFilterValue,
  filterValue,
  initialValue = '',
}: ClearFilterButtonProps) => (
  <>
    {filterValue !== initialValue && (
      <Button
        size="sm"
        variant="light text-danger border border-right border-top border-bottom"
        onClick={() => setFilterValue(initialValue)}
        title="clear"
      >
        &#x2715;
      </Button>
    )}
  </>
);

export interface FilterProps {
  placeholder: string;
  setFilterFn?: (fn: (row: Row<any>, columnId: string, value: FilterValue) => boolean) => void;
  setFilterValue: (value: FilterValue) => void;
  allowFilterFnChange?: boolean;
  filterValue: FilterValue;
  inputProps?: any;
  type: FilterType;
  enumOptions?: EnumOption[];
}

const Filter = (props: FilterProps) => {
  return (
    <>
      {props.type === FilterType.STRING && <StringFilter {...props} />}
      {props.type === FilterType.NUMBER && <NumberFilter {...props} />}
      {props.type === FilterType.DATE && <DateRangeFilter {...props} />}
      {props.type === FilterType.ENUM && <EnumFilter {...props} />}
    </>
  );
};

export default Filter;
