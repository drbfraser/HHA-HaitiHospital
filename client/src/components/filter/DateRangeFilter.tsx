import { Button, Form, InputGroup } from 'react-bootstrap';
import DatePicker, { DayRange, DayValue } from 'react-modern-calendar-datepicker';
import { getDateFromDateStr, isDateInRange } from 'utils';

import { FilterProps } from './Filter';
import { useEffect } from 'react';

const getDateStrFromDayValue = (day: DayValue) =>
  day ? `${day.day}/${day.month}/${day.year}` : '';

export const dateRangeFilterFn = (row, columnId, value: DayRange) => {
  const dateStr = row.getValue(columnId);

  return isDateInRange(getDateFromDateStr(dateStr), value);
};

export const DateRangeFilter = ({
  placeholder,
  setFilterFn,
  setFilterValue,
  filterValue,
  inputProps,
}: FilterProps) => {
  useEffect(() => {
    setFilterFn(dateRangeFilterFn);
  }, [setFilterFn]);

  return (
    <DatePicker
      onChange={(value) => setFilterValue(value as DayRange)}
      shouldHighlightWeekends
      value={
        {
          from: filterValue ? (filterValue as DayRange).from : null,
          to: filterValue ? (filterValue as DayRange).to : null,
        } as DayRange
      }
      renderInput={({ ref }) => {
        const dayRange = filterValue as DayRange;

        const fromStr = getDateStrFromDayValue(dayRange?.from);
        const toStr = getDateStrFromDayValue(dayRange?.to);

        const value = `${fromStr} - ${toStr}`;

        return (
          <InputGroup className="my-2" {...inputProps}>
            <Form.Control
              ref={ref}
              type="text"
              placeholder={placeholder}
              value={fromStr || toStr ? value : ''}
              readOnly
              {...inputProps}
            />
            {filterValue && (
              <Button
                size="sm"
                variant="light text-danger border border-right border-top border-bottom"
                onClick={() => setFilterValue('')}
                title="clear"
              >
                &#x2715;
              </Button>
            )}
          </InputGroup>
        );
      }}
    />
  );
};
