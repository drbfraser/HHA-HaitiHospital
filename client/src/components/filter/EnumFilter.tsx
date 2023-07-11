import { FILTER_DEFAULT_VALUE, FilterProps } from './Filter';
import { useCallback, useEffect } from 'react';

import { InputGroup } from 'react-bootstrap';
import Select from 'react-select';

export type EnumOption = Record<string, string>;

export const EnumFilter = ({
  placeholder,
  setFilterValue,
  setFilterFn = (_) => {},
  filterValue = FILTER_DEFAULT_VALUE.ENUM,
  inputProps,
  enumOptions,
}: FilterProps) => {
  useEffect(() => {
    setFilterFn((rows, id, filterValue: string[]) => {
      return filterValue.length === 0 || filterValue.includes(rows.getValue(id));
    });
  }, [setFilterFn]);

  const value: string[] = (filterValue as string[]) ?? FILTER_DEFAULT_VALUE.ENUM;

  const filterSelected = useCallback(
    (value: string[]) => enumOptions.filter((option) => value.includes(option.value)),
    [enumOptions],
  );

  return (
    <>
      <InputGroup className="my-2" {...inputProps}>
        <Select
          defaultValue={filterSelected(value)}
          placeholder={placeholder}
          onChange={(value: EnumOption[]) => {
            const values = value.map((option) => option.value);

            setFilterValue(values);
          }}
          options={enumOptions}
          isMulti
        />
      </InputGroup>
    </>
  );
};
