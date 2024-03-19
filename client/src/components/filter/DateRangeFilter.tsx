import { ClearFilterButton, FILTER_DEFAULT_VALUE, FilterProps } from './Filter';
import DatePicker, { DayRange, DayValue } from 'react-modern-calendar-datepicker';
import { Form, InputGroup } from 'react-bootstrap';
import { getDateFromDateStr, isDateInRange } from 'utils';

import { useEffect } from 'react';
import { Row } from '@tanstack/react-table';

const getDateStrFromDayValue = (day: DayValue) =>
  day ? `${day.day}/${day.month}/${day.year}` : '';

export const dateRangeFilterFn = (row: Row<string>, columnId: string, value: DayRange) => {
  const dateStr: string = row.getValue(columnId);
  return isDateInRange(getDateFromDateStr(dateStr), value);
};

export const DateRangeFilter = ({
  placeholder,
  setFilterFn = (_) => {},
  setFilterValue,
  filterValue = FILTER_DEFAULT_VALUE.DATE,
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

        const value = fromStr || toStr ? `${fromStr} - ${toStr}` : '';

        return (
          <InputGroup className="my-2" {...inputProps}>
            <Form.Control
              ref={ref}
              type="text"
              placeholder={placeholder}
              value={value}
              readOnly
              {...inputProps}
            />
            <ClearFilterButton
              setFilterValue={setFilterValue}
              filterValue={filterValue}
              initialValue={FILTER_DEFAULT_VALUE.DATE}
            />
          </InputGroup>
        );
      }}
    />
  );
};
