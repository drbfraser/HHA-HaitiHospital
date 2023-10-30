import { ClearFilterButton, FILTER_DEFAULT_VALUE, FilterProps } from './Filter';
import DatePicker, { DayRange, DayValue } from 'react-modern-calendar-datepicker';
import { Form, InputGroup } from 'react-bootstrap';
import { getDateFromDateStr, isDateInRange } from 'utils';

import { useEffect, useState } from 'react';

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
  filterValue = FILTER_DEFAULT_VALUE.DATE,
  inputProps,
}: FilterProps) => {
  useEffect(() => {
    setFilterFn(dateRangeFilterFn);
  }, [setFilterFn]);

  const [showMargin, setShowMargin] = useState(false);

  return (
    <div style={showMargin ? { marginBottom: '400px' } : {}}>
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
                onFocus={() => {
                  setShowMargin(true);
                }}
                onBlur={() => {
                  setShowMargin(false);
                }}
              />
              <ClearFilterButton
                setFilterValue={setFilterValue}
                filterValue={filterValue}
                initialValue={FILTER_DEFAULT_VALUE.DATE}
                executeOnClick={() => {
                  setShowMargin(true);
                }}
              />
            </InputGroup>
          );
        }}
      />
    </div>
  );
};
