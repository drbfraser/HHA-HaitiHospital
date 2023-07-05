import { ClearFilterButton, FILTER_DEFAULT_VALUE, FilterProps } from './Filter';
import { FormSelect, InputGroup } from 'react-bootstrap';

import { useEffect } from 'react';

export type EnumOption = Record<string, string>;

export const EnumFilter = ({
  placeholder,
  setFilterValue,
  setFilterFn = (_) => {},
  filterValue,
  inputProps,
  enumOptions,
}: FilterProps) => {
  useEffect(() => {
    setFilterFn((rows, id, filterValue: string[]) => {
      return filterValue.length === 0 || filterValue.includes(rows.getValue(id));
    });
  }, [setFilterFn]);

  return (
    <>
      <InputGroup className="my-2" {...inputProps}>
        <FormSelect
          value={filterValue as string[]}
          placeholder={placeholder}
          onChange={(e) => {
            setFilterValue(Array.from(e.target.selectedOptions).map((x) => x.value));
          }}
          multiple
        >
          {enumOptions &&
            enumOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </FormSelect>
        <ClearFilterButton
          setFilterValue={setFilterValue}
          filterValue={filterValue}
          initialValue={FILTER_DEFAULT_VALUE.ENUM}
        />
      </InputGroup>
    </>
  );
};
