import { EnumFilter, EnumOption } from './EnumFilter';

import { Button } from 'react-bootstrap';
import { DateRangeFilter } from './DateRangeFilter';
import { DayRange } from 'react-modern-calendar-datepicker';
import { FilterFunction, NumberFilter } from './NumberFilter';
import { StringFilter } from './StringFilter';

export type FilterValue = string | number | string[] | DayRange;

export const enum FilterType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  ENUM = 'ENUM',
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
  initialValue,
}: ClearFilterButtonProps) => (
  <>
    {initialValue && filterValue !== initialValue && (
      <Button
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
  setFilterFn?: (fn: FilterFunction) => void;
  setFilterValue: (value: FilterValue) => void;
  allowFilterFnChange?: boolean;
  filterValue: FilterValue;
  inputProps?: any;
  type: FilterType;
  enumOptions?: EnumOption[];
}

const Filter: React.FC<FilterProps> = (props) => {
  switch (props.type) {
    case FilterType.STRING:
      return <StringFilter {...props} />;
    case FilterType.NUMBER:
      return <NumberFilter {...props} />;
    case FilterType.DATE:
      return <DateRangeFilter {...props} />;
    case FilterType.ENUM:
      return <EnumFilter {...props} />;
    default:
      return null;
  }
};

export default Filter;
