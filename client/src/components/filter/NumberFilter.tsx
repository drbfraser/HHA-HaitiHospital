import { ClearFilterButton, FILTER_DEFAULT_VALUE, FilterProps } from './Filter';
import { Form, InputGroup } from 'react-bootstrap';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '@tanstack/react-table';

export const FILTER_FUNCTIONS = {
  equal: (row: Row<T>, columnId, value) => row.getValue(columnId) === value,

  greaterThan: (row: Row<T>, columnId, value) => row.getValue(columnId) > value,

  lessThan: (row: Row<T>, columnId, value) => row.getValue(columnId) < value,
};

export const NumberFilter = ({
  placeholder,
  setFilterFn = (_) => {},
  allowFilterFnChange = false,
  setFilterValue,
  filterValue = FILTER_DEFAULT_VALUE.NUMBER,
  inputProps,
}: FilterProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    setFilterFn(FILTER_FUNCTIONS.equal);
  }, [setFilterFn]);

  return (
    <>
      <InputGroup className="my-2" {...inputProps}>
        <Form.Control
          type="number"
          onChange={(e) => {
            setFilterValue(e.target.value);
          }}
          value={filterValue as number}
          placeholder={placeholder}
        />
        <ClearFilterButton
          setFilterValue={setFilterValue}
          filterValue={filterValue}
          initialValue={FILTER_DEFAULT_VALUE.NUMBER}
        />
      </InputGroup>
      {allowFilterFnChange && (
        <Form.Select
          onChange={(e) => {
            switch (e.target.value) {
              case '1':
                setFilterFn(FILTER_FUNCTIONS.greaterThan);
                break;
              case '2':
                setFilterFn(FILTER_FUNCTIONS.lessThan);
                break;
              default:
                setFilterFn(FILTER_FUNCTIONS.equal);
                break;
            }
            setFilterValue(filterValue);
          }}
          {...inputProps}
        >
          <option>{t('NumberFilter.Equals') + ' (=)'}</option>
          <option value="1">{t('NumberFilter.GreaterThan') + ' (>)'}</option>
          <option value="2">{t('NumberFilter.LessThan') + ' (<)'}</option>
        </Form.Select>
      )}
    </>
  );
};
