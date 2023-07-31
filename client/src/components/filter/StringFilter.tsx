import { ClearFilterButton, FILTER_DEFAULT_VALUE, FilterProps } from './Filter';
import { Form, InputGroup } from 'react-bootstrap';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const FILTER_FUNCTIONS = {
  contains: (row, columnId, value) =>
    row.getValue(columnId).toLowerCase().includes(value.toLowerCase()),

  equal: (row, columnId, value) => row.getValue(columnId).toLowerCase() === value.toLowerCase(),

  startsWith: (row, columnId, value) =>
    row.getValue(columnId).toLowerCase().startsWith(value.toLowerCase()),

  endsWith: (row, columnId, value) =>
    row.getValue(columnId).toLowerCase().endsWith(value.toLowerCase()),
};

export const StringFilter = ({
  placeholder,
  setFilterFn = (_) => {},
  allowFilterFnChange = false,
  setFilterValue,
  filterValue = FILTER_DEFAULT_VALUE.STRING,
  inputProps,
}: FilterProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    setFilterFn(FILTER_FUNCTIONS.contains);
  }, [setFilterFn]);

  const value: string = (filterValue as string) ?? FILTER_DEFAULT_VALUE.STRING;

  return (
    <>
      <InputGroup className="my-2" {...inputProps}>
        <Form.Control
          type="text"
          onChange={(e) => {
            setFilterValue(e.target.value);
          }}
          value={value}
          placeholder={placeholder}
        />
        <ClearFilterButton
          setFilterValue={setFilterValue}
          filterValue={filterValue}
          initialValue={FILTER_DEFAULT_VALUE.STRING}
        />
      </InputGroup>
      {allowFilterFnChange && (
        <Form.Select
          onChange={(e) => {
            switch (e.target.value) {
              case '1':
                setFilterFn(FILTER_FUNCTIONS.equal);
                break;
              case '2':
                setFilterFn(FILTER_FUNCTIONS.startsWith);
                break;
              case '3':
                setFilterFn(FILTER_FUNCTIONS.endsWith);
                break;
              default:
                setFilterFn(FILTER_FUNCTIONS.contains);
                break;
            }
            setFilterValue(filterValue);
          }}
          {...inputProps}
        >
          <option>{t('StringFilter.Contains')}</option>
          <option value="1">{t('StringFilter.Equals')}</option>
          <option value="2">{t('StringFilter.StartsWith')}</option>
          <option value="3">{t('StringFilter.EndsWith')}</option>
        </Form.Select>
      )}
    </>
  );
};
